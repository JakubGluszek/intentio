use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Array, Datetime, Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result, W},
    store::Creatable,
    utils::{map, XTake, XTakeVal},
};

use super::Minutes;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Session {
    id: String,
    #[ts(type = "number")]
    duration: Minutes,
    intent_id: Option<String>,
    started_at: String,
    finished_at: String,
    timestamps: Vec<String>, // [paused_at, resumed_at, paused_at, ...] epoch in milliseconds
}

impl TryFrom<Object> for Session {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let session = Self {
            id: val.x_take_val("id")?,
            duration: val.x_take_val("duration")?,
            intent_id: val.x_take("intent_id")?,
            started_at: val.x_take_val("started_at")?,
            finished_at: val.x_take_val("finished_at")?,
            timestamps: val
                .x_take_val::<Array>("timestamps")?
                .into_iter()
                .map(|v| W(v).try_into())
                .collect::<Result<Vec<_>>>()?,
        };

        Ok(session)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SessionForCreate {
    #[ts(type = "number")]
    duration: Minutes,
    intent_id: Option<String>,
    started_at: String,
    timestamps: Vec<String>,
}

impl From<SessionForCreate> for Value {
    fn from(val: SessionForCreate) -> Value {
        let timestamps = val
            .timestamps
            .into_iter()
            .map(Value::from)
            .collect::<Vec<Value>>();

        let mut data = map![
            "duration".into() => val.duration.into(),
            "started_at".into() => val.started_at.into(),
            "timestamps".into() => timestamps.into(),
        ];

        if let Some(intent_id) = val.intent_id {
            data.insert("intent_id".into(), intent_id.into());
        }

        Value::Object(data.into())
    }
}

impl Creatable for SessionForCreate {}

pub struct SessionBmc {}

impl SessionBmc {
    const ENTITY: &'static str = "session";

    pub async fn get_multi(ctx: Arc<Ctx>) -> Result<Vec<Session>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }

    pub async fn create(ctx: Arc<Ctx>, data: SessionForCreate) -> Result<Session> {
        let sql = "CREATE type::table($tb) CONTENT $data RETURN AFTER";

        let mut data: Object = W(data.into()).try_into()?;
        let now = Datetime::default().timestamp_millis().to_string();
        data.insert("finished_at".into(), now.into());

        let vars = map![
			"tb".into() => Self::ENTITY.into(),
			"data".into() => Value::from(data)];

        let store = ctx.get_store();

        let ress = store.ds.execute(sql, &store.ses, Some(vars), false).await?;
        let first_val = ress
            .into_iter()
            .next()
            .map(|r| r.result)
            .expect("data not returned")?;

        if let Value::Object(val) = first_val.first() {
            ctx.emit_event("session_saved", val.clone());

            val.try_into()
        } else {
            Err(Error::StoreFailToCreate(format!(
                "exec_create {{Self::ENTITY}}, nothing returned."
            )))
        }
    }
}

#[cfg(test)]
mod tests {
    use surrealdb::sql::Datetime;

    use super::*;

    #[tokio::test]
    async fn create_session() -> Result<()> {
        let ctx = Ctx::test().await;

        let data = SessionForCreate {
            started_at: Datetime::default().timestamp().to_string(),
            duration: 25,
            intent_id: None,
            timestamps: vec![],
        };

        let session = SessionBmc::create(ctx, data).await?;

        assert_eq!(session.duration, 25);

        Ok(())
    }
}
