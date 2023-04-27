use std::collections::BTreeMap;
use std::sync::Arc;

use serde::{Deserialize, Serialize};
use surrealdb::sql::{thing, Array, Datetime, Object, Value};
use ts_rs::TS;

use crate::database::{Database, Patchable};
use crate::prelude::*;
use crate::utils::XTake;
use crate::{
    ctx::Ctx,
    database::Creatable,
    prelude::Error,
    utils::{map, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Intent {
    id: String,
    label: String,
    pinned: bool,
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
        let now = Datetime::default().timestamp_millis().to_string();

        let data: BTreeMap<_, Value> = map![
            "label".into() => val.label.into(),
            "created_at".into() => now.into(),
            "pinned".into() => false.into(),
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

        Value::Object(data.into())
    }
}

impl Patchable for IntentForUpdate {}

pub struct IntentBmc {}

impl IntentBmc {
    const ENTITY: &'static str = "intent";

    pub async fn create(ctx: Arc<Ctx>, data: IntentForCreate) -> Result<Intent> {
        let obj = ctx.get_database().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("intent_created", obj.clone());

        obj.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: IntentForUpdate) -> Result<Intent> {
        let obj = ctx.get_database().exec_merge(id, data).await?;

        ctx.emit_event("intent_updated", obj.clone());

        obj.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let database = ctx.get_database();

        let id = database.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("intent_deleted", data.clone());

        Ok(data)
    }

    pub async fn list(database: Arc<Database>) -> Result<Vec<Intent>> {
        let objects = database.exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }

    pub async fn archive(ctx: Arc<Ctx>, id: &str) -> Result<Intent> {
        let database = ctx.get_database();

        let now = Datetime::default().timestamp_millis().to_string();

        let sql = "UPDATE $th SET archived_at = $timestamp RETURN AFTER";

        let vars = map![
			"th".into() => thing(id)?.into(),
			"timestamp".into() => now.into()];

        let ress = database
            .ds
            .execute(sql, &database.ses, Some(vars), true)
            .await?;

        let first_res = ress.into_iter().next().expect("object not returned");

        let result = first_res.result?;

        if let Value::Object(val) = result.first() {
            ctx.emit_event("intent_archived", val.clone());

            val.try_into()
        } else {
            Err(Error::DatabaseFailToCreate(f!(
                "can't update {id}, nothing returned."
            )))
        }
    }

    pub async fn unarchive(ctx: Arc<Ctx>, id: &str) -> Result<Intent> {
        let database = ctx.get_database();

        let sql = "UPDATE $th SET archived_at = NONE RETURN AFTER";

        let vars = map!["th".into() => thing(id)?.into()];

        let ress = database
            .ds
            .execute(sql, &database.ses, Some(vars), true)
            .await?;

        let first_res = ress.into_iter().next().expect("object not returned");

        let result = first_res.result?;

        if let Value::Object(val) = result.first() {
            ctx.emit_event("intent_unarchived", val.clone());

            val.try_into()
        } else {
            Err(Error::DatabaseFailToCreate(f!(
                "can't update {id}, nothing returned."
            )))
        }
    }
}

#[cfg(test)]
mod tests {}
