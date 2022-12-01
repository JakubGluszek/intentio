use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::model::{Project, QueueSession};

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SessionQueue {
    id: String,
    name: String,
    sessions: Vec<QueueSession>,

    #[ts(type = "number")]
    session_idx: i64,

    #[ts(type = "number")]
    session_cycle: i64,

    #[ts(type = "number")]
    iterations: i64,
}

pub struct State {
    pub session_queue: Option<SessionQueue>,
    pub current_project: Option<Project>,
}

impl Default for State {
    fn default() -> Self {
        State {
            session_queue: None,
            current_project: None,
        }
    }
}
