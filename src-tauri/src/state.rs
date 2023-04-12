use std::sync::Arc;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{ctx::Ctx, models::Theme};

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

pub fn update_current_theme(ctx: Arc<Ctx>, state: &AppState) {
    if state.timer.is_playing == false {
        ctx.emit_event("current_theme_updated", state.idle_theme.clone());
    } else {
        match state.timer.session_type {
            SessionType::Focus => {
                ctx.emit_event("current_theme_updated", state.focus_theme.clone())
            }
            SessionType::Break => {
                ctx.emit_event("current_theme_updated", state.break_theme.clone())
            }
            SessionType::LongBreak => {
                ctx.emit_event("current_theme_updated", state.long_break_theme.clone())
            }
        }
    }
}
