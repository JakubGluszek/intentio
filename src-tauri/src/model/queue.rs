use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Array, Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result, W},
    store::{Creatable, Patchable},
    utils::{map, XTakeVal},
};

use super::{ModelDeleteResultData, QueueSession};

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Queue {
    id: String,
    name: String,
    sessions: Vec<QueueSession>,
}

impl TryFrom<Object> for Queue {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let queue = Queue {
            id: val.x_take_val("id")?,
            name: val.x_take_val("name")?,
            sessions: val
                .x_take_val::<Array>("sessions")?
                .into_iter()
                .map(|v| W(v).try_into())
                .collect::<Result<Vec<_>>>()?,
        };

        Ok(queue)
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueForCreate {
    name: String,
    sessions: Option<Vec<QueueSession>>,
}

impl From<QueueForCreate> for Value {
    fn from(val: QueueForCreate) -> Value {
        let mut data = map![
            "name".into() => val.name.into(),
        ];

        if let Some(sessions) = val.sessions {
            let sessions = sessions
                .into_iter()
                .map(Value::from)
                .collect::<Vec<Value>>();

            data.insert("sessions".into(), sessions.into());
        }

        Value::Object(data.into())
    }
}

impl Creatable for QueueForCreate {}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueForUpdate {
    name: Option<String>,
    sessions: Option<Vec<QueueSession>>,
}

impl From<QueueForUpdate> for Value {
    fn from(val: QueueForUpdate) -> Self {
        let mut data: BTreeMap<String, Value> = BTreeMap::new();

        if let Some(name) = val.name {
            data.insert("name".into(), name.into());
        }

        if let Some(sessions) = val.sessions {
            let sessions = sessions
                .into_iter()
                .map(Value::from)
                .collect::<Vec<Value>>();

            data.insert("sessions".into(), sessions.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for QueueForUpdate {}

pub struct QueueBmc {}

impl QueueBmc {
    const ENTITY: &'static str = "queue";

    pub async fn create(ctx: Arc<Ctx>, data: QueueForCreate) -> Result<Queue> {
        ctx.get_store()
            .exec_create(Self::ENTITY, data)
            .await?
            .try_into()
    }

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Queue> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: QueueForUpdate) -> Result<Queue> {
        ctx.get_store().exec_merge(id, data).await?.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let id = ctx.get_store().exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id);

        Ok(result)
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Queue>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_queue() -> Result<()> {
        let ctx = Ctx::test().await;

        let mut sessions = vec![];

        for _ in 0..4 {
            sessions.push(QueueSession::new("1".to_string(), None, 20, 2));
        }

        let data = QueueForCreate {
            name: "demo".into(),
            sessions: Some(sessions),
        };

        let queue = QueueBmc::create(ctx, data).await?;

        assert_eq!("demo".to_string(), queue.name);

        assert_eq!(4, queue.sessions.len());

        Ok(())
    }
}
