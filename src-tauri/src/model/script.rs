use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result},
    store::{Creatable, Patchable},
    utils::{map, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Script {
    id: String,
    label: String,
    body: String,
    active: bool,
    run_on_session_start: bool,
    run_on_session_pause: bool,
    run_on_session_end: bool,
    run_on_break_start: bool,
    run_on_break_pause: bool,
    run_on_break_end: bool,
}

impl TryFrom<Object> for Script {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Self> {
        let note = Self {
            id: val.x_take_val("id")?,
            label: val.x_take_val("label")?,
            body: val.x_take_val("body")?,
            active: val.x_take_val("active")?,
            run_on_session_start: val.x_take_val("run_on_session_start")?,
            run_on_session_pause: val.x_take_val("run_on_session_pause")?,
            run_on_session_end: val.x_take_val("run_on_session_end")?,
            run_on_break_start: val.x_take_val("run_on_break_start")?,
            run_on_break_pause: val.x_take_val("run_on_break_pause")?,
            run_on_break_end: val.x_take_val("run_on_break_end")?,
        };

        Ok(note)
    }
}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ScriptForCreate {
    label: String,
    body: String,
}

impl From<ScriptForCreate> for Value {
    fn from(val: ScriptForCreate) -> Self {
        let data = map![
            "label".into() => val.label.into(),
            "body".into() => val.body.into(),
            "active".into() => true.into(),
            "run_on_session_start".into() => false.into(),
            "run_on_session_pause".into() => false.into(),
            "run_on_session_end".into() => false.into(),
            "run_on_break_start".into() => false.into(),
            "run_on_break_pause".into() => false.into(),
            "run_on_break_end".into() => false.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for ScriptForCreate {}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ScriptForUpdate {
    label: Option<String>,
    body: Option<String>,
    active: Option<bool>,
    run_on_session_start: Option<bool>,
    run_on_session_pause: Option<bool>,
    run_on_session_end: Option<bool>,
    run_on_break_start: Option<bool>,
    run_on_break_pause: Option<bool>,
    run_on_break_end: Option<bool>,
}

impl From<ScriptForUpdate> for Value {
    fn from(val: ScriptForUpdate) -> Self {
        let mut data = BTreeMap::new();

        if let Some(label) = val.label {
            data.insert("label".into(), label.into());
        }
        if let Some(body) = val.body {
            data.insert("body".into(), body.into());
        }
        if let Some(active) = val.active {
            data.insert("active".into(), active.into());
        }
        if let Some(run_on_session_start) = val.run_on_session_start {
            data.insert("run_on_session_start".into(), run_on_session_start.into());
        }
        if let Some(run_on_session_pause) = val.run_on_session_pause {
            data.insert("run_on_session_pause".into(), run_on_session_pause.into());
        }
        if let Some(run_on_session_end) = val.run_on_session_end {
            data.insert("run_on_session_end".into(), run_on_session_end.into());
        }
        if let Some(run_on_break_start) = val.run_on_break_start {
            data.insert("run_on_break_start".into(), run_on_break_start.into());
        }
        if let Some(run_on_break_pause) = val.run_on_break_pause {
            data.insert("run_on_break_pause".into(), run_on_break_pause.into());
        }
        if let Some(run_on_break_end) = val.run_on_break_end {
            data.insert("run_on_break_end".into(), run_on_break_end.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for ScriptForUpdate {}

pub struct ScriptBmc {}

impl ScriptBmc {
    const ENTITY: &'static str = "script";

    pub async fn create(ctx: Arc<Ctx>, data: ScriptForCreate) -> Result<Script> {
        let obj = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("script_created", obj.clone());

        obj.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ScriptForUpdate) -> Result<Script> {
        let obj = ctx.get_store().exec_merge(id, data).await?;

        ctx.emit_event("script_updated", obj.clone());

        obj.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let store = ctx.get_store();

        let id = store.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("script_deleted", data.clone());

        Ok(data)
    }

    pub async fn get_multi(ctx: Arc<Ctx>) -> Result<Vec<Script>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}
