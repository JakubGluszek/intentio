use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use surrealdb::sql::{Array, Datetime, Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result, W},
    database::{Creatable, Patchable},
    utils::{map, XTake, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Task {
    id: String,
    body: String,
    done: bool,
    intent_id: Option<String>,
    created_at: String,
    finished_at: Option<String>,
}

impl TryFrom<Object> for Task {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Self> {
        let note = Self {
            id: val.x_take_val("id")?,
            body: val.x_take_val("body")?,
            done: val.x_take_val("done")?,
            intent_id: val.x_take("intent_id")?,
            created_at: val.x_take_val("created_at")?,
            finished_at: val.x_take("finished_at")?,
        };

        Ok(note)
    }
}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TaskForCreate {
    body: String,
    intent_id: Option<String>,
}

impl From<TaskForCreate> for Value {
    fn from(val: TaskForCreate) -> Self {
        let now = Datetime::default().timestamp_millis().to_string();

        let data = map![
            "body".into() => val.body.into(),
            "intent_id".into() => val.intent_id.into(),
            "done".into() => false.into(),
            "created_at".into() => now.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for TaskForCreate {}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TaskForUpdate {
    body: Option<String>,
    done: Option<bool>,
}

impl From<TaskForUpdate> for Value {
    fn from(val: TaskForUpdate) -> Self {
        let mut data = BTreeMap::new();

        if let Some(body) = val.body {
            data.insert("body".into(), body.into());
        }

        if let Some(done) = val.done {
            data.insert("done".into(), done.into());

            if done {
                let now = Datetime::default().timestamp_millis().to_string();
                data.insert("finished_at".into(), now.into());
            }
        }

        Value::Object(data.into())
    }
}

impl Patchable for TaskForUpdate {}

pub struct TaskBmc {}

impl TaskBmc {
    const ENTITY: &'static str = "task";

    pub async fn create(ctx: Arc<Ctx>, data: TaskForCreate) -> Result<Task> {
        let obj = ctx.get_database().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("task_created", obj.clone());

        obj.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: TaskForUpdate) -> Result<Task> {
        let obj = ctx.get_database().exec_merge(id, data).await?;

        ctx.emit_event("task_updated", obj.clone());

        obj.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let database = ctx.get_database();

        let id = database.exec_delete(id).await?;
        let data = ModelDeleteResultData::from(id.clone());

        ctx.emit_event("task_deleted", data.clone());

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

        ctx.emit_event("tasks_deleted", data.clone());

        Ok(data)
    }

    pub async fn get_multi(ctx: Arc<Ctx>) -> Result<Vec<Task>> {
        let objects = ctx.get_database().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }

    pub async fn get_multi_by_intent_id(
        ctx: Arc<Ctx>,
        intent_id: Option<String>,
    ) -> Result<Vec<Task>> {
        let database = ctx.get_database();

        let sql = "SELECT * FROM task WHERE intent_id = $intent_id";

        let vars = map!["intent_id".into() => intent_id.unwrap().into()];

        let ress = database
            .ds
            .execute(&sql, &database.ses, Some(vars), false)
            .await?;

        let first_res = ress.into_iter().next().expect("Did not get a response");

        // Get the result value as value array (fail if it is not)
        let array: Array = W(first_res.result?).try_into()?;

        // build the list of objects
        let objects: Vec<Object> = array
            .into_iter()
            .map(|value| W(value).try_into())
            .collect::<Result<Vec<_>>>()
            .unwrap();

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}
