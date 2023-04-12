use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Datetime, Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    database::{Creatable, Patchable},
    prelude::{Error, Result},
    utils::{map, XTake, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Note {
    id: String,
    body: String,
    intent_id: Option<String>,
    created_at: String,
    modified_at: String,
}

impl TryFrom<Object> for Note {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Self> {
        let note = Self {
            id: val.x_take_val("id")?,
            body: val.x_take_val("body")?,
            intent_id: val.x_take("intent_id")?,
            created_at: val.x_take_val("created_at")?,
            modified_at: val.x_take_val("modified_at")?,
        };

        Ok(note)
    }
}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct NoteForCreate {
    body: String,
    intent_id: Option<String>,
}

impl From<NoteForCreate> for Value {
    fn from(val: NoteForCreate) -> Self {
        let now = Datetime::default().timestamp_millis().to_string();

        let data = map![
            "body".into() => val.body.into(),
            "intent_id".into() => val.intent_id.into(),
            "created_at".into() => now.clone().into(),
            "modified_at".into() => now.into()
        ];

        Value::Object(data.into())
    }
}

impl Creatable for NoteForCreate {}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct NoteForUpdate {
    body: Option<String>,
}

impl From<NoteForUpdate> for Value {
    fn from(val: NoteForUpdate) -> Self {
        let mut data = BTreeMap::new();

        if let Some(body) = val.body {
            data.insert("body".into(), body.into());

            let now = Datetime::default().timestamp_millis().to_string();
            data.insert("modified_at".into(), now.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for NoteForUpdate {}

pub struct NoteBmc {}

impl NoteBmc {
    const ENTITY: &'static str = "note";

    pub async fn create(ctx: Arc<Ctx>, data: NoteForCreate) -> Result<Note> {
        let obj = ctx.get_database().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("note_created", obj.clone());

        obj.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: NoteForUpdate) -> Result<Note> {
        let obj = ctx.get_database().exec_merge(id, data).await?;

        ctx.emit_event("note_updated", obj.clone());

        obj.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let database = ctx.get_database();

        let id = database.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("note_deleted", data.clone());

        Ok(data)
    }

    pub async fn delete_multi(
        ctx: Arc<Ctx>,
        ids: Vec<String>,
    ) -> Result<Vec<ModelDeleteResultData>> {
        let database = ctx.get_database();

        let mut data: Vec<ModelDeleteResultData> = vec![];

        for id in ids {
            let id = database.exec_delete(&id).await?;
            let result = ModelDeleteResultData::from(id);
            data.push(result);
        }

        ctx.emit_event("notes_deleted", data.clone());

        Ok(data)
    }

    pub async fn get_multi(ctx: Arc<Ctx>) -> Result<Vec<Note>> {
        let objects = ctx.get_database().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}
