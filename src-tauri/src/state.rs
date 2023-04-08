use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::models::Theme;

#[derive(Serialize, Deserialize, Clone, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub enum SessionType {
    Focus,
    Break,
    LongBreak,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TimerState {
    pub is_playing: bool,
    pub session_type: SessionType,
}

#[derive(Deserialize, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerStateForUpdate {
    pub is_playing: Option<bool>,
    pub session_type: Option<SessionType>,
}

impl Default for TimerState {
    fn default() -> Self {
        Self {
            is_playing: false,
            session_type: SessionType::Focus,
        }
    }
}

pub struct AppState {
    pub timer: TimerState,
    pub idle_theme: Theme,
    pub focus_theme: Theme,
    pub break_theme: Theme,
    pub long_break_theme: Theme,
}
