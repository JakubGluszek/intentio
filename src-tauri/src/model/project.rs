use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::prelude::Result;
use crate::{
    ctx::Ctx,
    prelude::Error,
    store::{Creatable, Patchable},
    utils::{map, XTakeVal},
};

use super::{fire_model_event, ModelDeleteResultData, TodoBmc};

#[derive(Serialize, TS, Debug)]
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

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ProjectForCreate {
    name: String,
    parent_id: Option<String>,
}

impl From<ProjectForCreate> for Value {
    fn from(val: ProjectForCreate) -> Value {
        let data = map![
            "name".into() => val.name.into(),
            "parent_id".into() => val.parent_id.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for ProjectForCreate {}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ProjectForUpdate {
    name: Option<String>,
    parent_id: Option<String>,
}

impl From<ProjectForUpdate> for Value {
    fn from(val: ProjectForUpdate) -> Value {
        let mut data = BTreeMap::new();

        if let Some(name) = val.name {
            data.insert("name".into(), name.into());
        }
        if let Some(parent_id) = val.parent_id {
            data.insert("parent_id".into(), parent_id.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for ProjectForUpdate {}

pub struct ProjectBmc {}

impl ProjectBmc {
    const ENTITY: &'static str = "project";

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Project> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: ProjectForCreate) -> Result<Project> {
        let result = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "create", result.clone());

        result.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ProjectForUpdate) -> Result<Project> {
        let result = ctx.get_store().exec_merge(id, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "update", result.clone());

        result.try_into()
    }

    /// Deletes the project itself
    /// Deletes all todos where todo.project_id = id
    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let store = ctx.get_store();

        let id = store.exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id);

        fire_model_event(&ctx, Self::ENTITY, "delete", result.clone());

        TodoBmc::delete_by_project(store.clone(), &result.id).await?;

        Ok(result)
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Project>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}

#[cfg(test)]
mod tests {}
