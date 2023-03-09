use crate::prelude::Seconds;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
enum SessionType {
    Focus,
    Break,
    LongBreak,
}

#[derive(TS, Serialize, Deserialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerSession {
    _type: SessionType,

    #[ts(type = "number")]
    duration: Seconds,

    #[ts(type = "number")]
    elapsed_time: Seconds,

    #[ts(type = "number")]
    iterations: i64,
    is_playing: bool,
    started_at: Option<String>,
    intent_id: Option<String>,
}

impl TimerSession {
    pub fn new(duration: Seconds) -> Self {
        Self {
            _type: SessionType::Focus,
            duration,
            elapsed_time: 0,
            iterations: 0,
            is_playing: false,
            started_at: None,
            intent_id: None,
        }
    }
}

pub struct State {
    pub session: TimerSession,
}

impl State {
    pub fn new(session: TimerSession) -> Self {
        Self { session }
    }
}
