use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::prelude::*;
use crate::store::Store;
use crate::{
    ctx::Ctx,
    prelude::Error,
    store::Creatable,
    utils::{map, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Project {
    id: String,
    name: String,
}

impl TryFrom<Object> for Project {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Project> {
        let project = Self {
            id: val.x_take_val("id")?,
            name: val.x_take_val("name")?,
        };

        Ok(project)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ProjectForCreate {
    name: String,
}

impl From<ProjectForCreate> for Value {
    fn from(val: ProjectForCreate) -> Value {
        let data = map![
            "name".into() => val.name.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for ProjectForCreate {}

pub struct ProjectBmc {}

impl ProjectBmc {
    const ENTITY: &'static str = "project";

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Project> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: ProjectForCreate) -> Result<Project> {
        let obj = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("project_created", obj.clone());

        obj.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let store = ctx.get_store();

        let id = store.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("project_deleted", data.clone());

        Ok(data)
    }

    pub async fn list(store: Arc<Store>) -> Result<Vec<Project>> {
        let objects = store.exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}

#[cfg(test)]
mod tests {}
