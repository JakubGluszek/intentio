use serde::{Deserialize, Serialize};
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    prelude::{Error, Result},
    utils::{map, XTake, XTakeVal},
};

use super::Minutes;

// Queue Session
#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSession {
    id: String,
    project_id: Option<String>,

    #[ts(type = "number")]
    duration: Minutes,

    #[ts(type = "number")]
    cycles: i64,
}

impl QueueSession {
    pub fn new(id: String, project_id: Option<String>, duration: Minutes, cycles: i64) -> Self {
        Self {
            id,
            project_id,
            duration,
            cycles,
        }
    }
}

impl TryFrom<Object> for QueueSession {
    type Error = Error;

    fn try_from(mut val: Object) -> Result<Self> {
        let queue_session = QueueSession {
            id: val.x_take_val("id")?,
            project_id: val.x_take("project_id")?,
            duration: val.x_take_val("duration")?,
            cycles: val.x_take_val("cycles")?,
        };

        Ok(queue_session)
    }
}

impl From<QueueSession> for Value {
    fn from(val: QueueSession) -> Value {
        let mut data = map![
            "id".into() => val.id.into(),
            "duration".into() => val.duration.into(),
            "cycles".into() => val.cycles.into(),
        ];

        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
        }

        Value::Object(data.into())
    }
}
