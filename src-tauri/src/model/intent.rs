use std::collections::BTreeMap;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Array, Object, Value};
use ts_rs::TS;

use crate::prelude::*;
use crate::store::{Patchable, Store};
use crate::utils::XTake;
use crate::{
    ctx::Ctx,
    prelude::Error,
    store::Creatable,
    utils::{map, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Intent {
    id: String,
    label: String,
    pinned: bool,
    tags: Vec<String>,
    created_at: String,
    archived_at: Option<String>,
}

impl TryFrom<Object> for Intent {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Intent> {
        let intent = Self {
            id: val.x_take_val("id")?,
            label: val.x_take_val("label")?,
            pinned: val.x_take_val("pinned")?,
            tags: val
                .x_take_val::<Array>("tags")?
                .into_iter()
                .map(|v| W(v).try_into())
                .collect::<Result<Vec<_>>>()?,
            created_at: val.x_take_val("created_at")?,
            archived_at: val.x_take("archived_at")?,
        };

        Ok(intent)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct IntentForCreate {
    label: String,
}

impl From<IntentForCreate> for Value {
    fn from(val: IntentForCreate) -> Value {
        let data = map![
            "label".into() => val.label.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for IntentForCreate {}

#[derive(Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct IntentForUpdate {
    label: Option<String>,
    pinned: Option<bool>,
    tags: Option<Vec<String>>,
}

impl From<IntentForUpdate> for Value {
    fn from(val: IntentForUpdate) -> Self {
        let mut data = BTreeMap::new();
        if let Some(label) = val.label {
            data.insert("label".into(), label.into());
        }
        if let Some(pinned) = val.pinned {
            data.insert("pinned".into(), pinned.into());
        }
        if let Some(tags) = val.tags {
            let tags = tags.into_iter().map(Value::from).collect::<Vec<Value>>();

            data.insert("tags".into(), tags.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for IntentForUpdate {}

pub struct IntentBmc {}

impl IntentBmc {
    const ENTITY: &'static str = "intent";

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Intent> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: IntentForCreate) -> Result<Intent> {
        let obj = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("intent_created", obj.clone());

        obj.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: IntentForUpdate) -> Result<Intent> {
        ctx.get_store().exec_merge(id, data).await?.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let store = ctx.get_store();

        let id = store.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("intent_deleted", data.clone());

        Ok(data)
    }

    pub async fn list(store: Arc<Store>) -> Result<Vec<Intent>> {
        let objects = store.exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }

    pub async fn archive() {}

    pub async fn unarchive() {}
}

#[cfg(test)]
mod tests {}
