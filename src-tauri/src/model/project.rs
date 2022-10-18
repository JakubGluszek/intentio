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

use super::{
    bmc_base::{bmc_create, bmc_delete, bmc_get, bmc_list, bmc_update},
    ModelDeleteResultData,
};

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings")]
pub struct Project {
    id: String,
    name: String,
    parent_id: Option<String>,
}

impl TryFrom<Object> for Project {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Project> {
        let project = Self {
            id: val.x_take_val("id")?,
            name: val.x_take_val("name")?,
            parent_id: val.x_take("parent_id")?,
        };

        Ok(project)
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings")]
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
#[ts(export, export_to = "../src/bindings")]
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
        bmc_get(ctx, Self::ENTITY, id).await
    }

    pub async fn create(ctx: Arc<Ctx>, data: ProjectForCreate) -> Result<Project> {
        bmc_create(ctx, Self::ENTITY, data).await
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ProjectForUpdate) -> Result<Project> {
        bmc_update(ctx, Self::ENTITY, id, data).await
    }

    // TODO: On delete handle children projects. (change parent | delete).
    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        bmc_delete(ctx, Self::ENTITY, id).await
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Project>> {
        bmc_list(ctx, Self::ENTITY).await
    }
}
