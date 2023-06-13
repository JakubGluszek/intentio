use serde::{Deserialize, Serialize};
use std::sync::Arc;
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

impl AppState {
    pub fn update_current_theme(self: &AppState, ctx: Arc<Ctx>) {
        if self.timer.is_playing == false {
            ctx.emit_event("current_theme_updated", self.idle_theme.clone());
        } else {
            match self.timer.session_type {
                SessionType::Focus => {
                    ctx.emit_event("current_theme_updated", self.focus_theme.clone())
                }
                SessionType::Break => {
                    ctx.emit_event("current_theme_updated", self.break_theme.clone())
                }
                SessionType::LongBreak => {
                    ctx.emit_event("current_theme_updated", self.long_break_theme.clone())
                }
            }
        }
    }
}
