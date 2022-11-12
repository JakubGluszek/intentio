use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::model::QueueSession;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ActiveQueue {
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
    active_queue: Option<ActiveQueue>,
}

impl Default for State {
    fn default() -> Self {
        State { active_queue: None }
    }
}

impl State {
    pub fn get_active_queue(&self) -> Option<ActiveQueue> {
        self.active_queue.clone()
    }

    pub fn set_active_queue(&mut self, data: ActiveQueue) -> Option<ActiveQueue> {
        self.active_queue = Some(data);
        self.active_queue.clone()
    }

    pub fn deactivate_queue(&mut self) {
        self.active_queue = None;
    }
}
