use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Datetime, Object, Value};
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
    started_at: String,
    finished_at: String,
    project_id: Option<String>,

    #[ts(type = "number")]
    duration: Minutes,
}

impl TryFrom<Object> for Session {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let session = Self {
            id: val.x_take_val("id")?,
            started_at: val.x_take_val("started_at")?,
            finished_at: val.x_take_val("finished_at")?,
            project_id: val.x_take("project_id")?,
            duration: val.x_take_val("duration")?,
        };

        Ok(session)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SessionForCreate {
    started_at: String,
    project_id: Option<String>,

    #[ts(type = "number")]
    duration: Minutes,
}

impl From<SessionForCreate> for Value {
    fn from(val: SessionForCreate) -> Value {
        let mut data = map![
            "duration".into() => val.duration.into(),
            "started_at".into() => val.started_at.into(),
        ];

        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
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
            project_id: None,
        };

        let session = SessionBmc::create(ctx, data).await?;

        assert_eq!(session.duration, 25);

        Ok(())
    }
}
