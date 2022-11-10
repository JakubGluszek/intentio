use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result},
    store::{Creatable, Patchable},
    utils::{map, XTake, XTakeVal},
};

use super::{Minutes, ModelDeleteResultData};

// Queue Session
#[derive(Serialize, Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSession {
    id: String,
    project_id: Option<String>,

    #[ts(type = "number")]
    duration: Minutes,
}

impl TryFrom<Object> for QueueSession {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let queue_session = QueueSession {
            id: val.x_take_val("id")?,
            project_id: val.x_take("project_id")?,
            duration: val.x_take_val("duration")?,
        };

        Ok(queue_session)
    }
}

impl From<QueueSession> for Value {
    fn from(val: QueueSession) -> Value {
        let mut data = map![
            "id".into() => val.id.into(),
            "duration".into() => val.duration.into(),
        ];

        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
        }

        Value::Object(data.into())
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSessionForCreate {
    project_id: Option<String>,
    duration: Minutes,
}

impl QueueSessionForCreate {
    pub fn new(project_id: Option<String>, duration: Minutes) -> Self {
        Self {
            project_id,
            duration,
        }
    }
}

impl From<QueueSessionForCreate> for Value {
    fn from(val: QueueSessionForCreate) -> Value {
        let mut data = map![
            "duration".into() => val.duration.into(),
        ];

        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
        }

        Value::Object(data.into())
    }
}

impl Creatable for QueueSessionForCreate {}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSessionForUpdate {
    duration: Option<Minutes>,
    project_id: Option<String>,
}

impl From<QueueSessionForUpdate> for Value {
    fn from(val: QueueSessionForUpdate) -> Self {
        let mut data = BTreeMap::new();
        if let Some(duration) = val.duration {
            data.insert("duration".into(), duration.into());
        }
        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for QueueSessionForUpdate {}

pub struct QueueSessionBmc {}

impl QueueSessionBmc {
    const ENTITY: &'static str = "queue_session";

    pub async fn create(ctx: Arc<Ctx>, data: QueueSessionForCreate) -> Result<QueueSession> {
        ctx.get_store()
            .exec_create(Self::ENTITY, data)
            .await?
            .try_into()
    }

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<QueueSession> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn update(
        ctx: Arc<Ctx>,
        id: &str,
        data: QueueSessionForUpdate,
    ) -> Result<QueueSession> {
        ctx.get_store().exec_merge(id, data).await?.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let id = ctx.get_store().exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id);

        Ok(result)
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<QueueSession>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}
