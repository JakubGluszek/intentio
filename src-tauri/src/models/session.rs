use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Datetime, Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    database::Creatable,
    prelude::{Error, Minutes, Result, W},
    utils::{map, XTake, XTakeVal},
};

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Session {
    id: String,
    intent_id: Option<String>,
    #[ts(type = "number")]
    duration: Minutes,
    summary: Option<String>,
    started_at: String,
    finished_at: String,
}

impl TryFrom<Object> for Session {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let session = Self {
            id: val.x_take_val("id")?,
            intent_id: val.x_take("intent_id")?,
            duration: val.x_take_val("duration")?,
            summary: val.x_take("summary")?,
            started_at: val.x_take_val("started_at")?,
            finished_at: val.x_take_val("finished_at")?,
        };

        Ok(session)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SessionForCreate {
    intent_id: Option<String>,
    #[ts(type = "number")]
    duration: Minutes,
    summary: Option<String>,
    started_at: String,
}

impl From<SessionForCreate> for Value {
    fn from(val: SessionForCreate) -> Value {
        let mut data = map![
            "duration".into() => val.duration.into(),
            "started_at".into() => val.started_at.into(),
        ];

        if let Some(intent_id) = val.intent_id {
            data.insert("intent_id".into(), intent_id.into());
        }
        if let Some(summary) = val.summary {
            data.insert("summary".into(), summary.into());
        }

        Value::Object(data.into())
    }
}

impl Creatable for SessionForCreate {}

pub struct SessionBmc {}

impl SessionBmc {
    const ENTITY: &'static str = "session";

    pub async fn get_multi(ctx: Arc<Ctx>) -> Result<Vec<Session>> {
        let objects = ctx.get_database().exec_select(Self::ENTITY).await?;

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

        let database = ctx.get_database();

        let ress = database
            .ds
            .execute(sql, &database.ses, Some(vars), false)
            .await?;
        let first_val = ress
            .into_iter()
            .next()
            .map(|r| r.result)
            .expect("data not returned")?;

        if let Value::Object(val) = first_val.first() {
            ctx.emit_event("session_saved", val.clone());

            val.try_into()
        } else {
            Err(Error::DatabaseFailToCreate(format!(
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
            summary: Some("Test summary".to_string()),
            duration: 25,
            intent_id: None,
        };

        let session = SessionBmc::create(ctx, data).await?;

        assert_eq!(session.duration, 25);

        Ok(())
    }
}
