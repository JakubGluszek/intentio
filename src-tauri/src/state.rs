use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use ts_rs::TS;

use crate::{models::Theme, prelude::Result};

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
    pub fn emit_current_theme(self: &AppState, app_handle: AppHandle) -> Result<()> {
        if self.timer.is_playing == false {
            app_handle.emit_all("current_theme_updated", self.idle_theme.clone())?;
        } else {
            match self.timer.session_type {
                SessionType::Focus => {
                    app_handle.emit_all("current_theme_updated", self.focus_theme.clone())?;
                }
                SessionType::Break => {
                    app_handle.emit_all("current_theme_updated", self.break_theme.clone())?;
                }
                SessionType::LongBreak => {
                    app_handle.emit_all("current_theme_updated", self.long_break_theme.clone())?;
                }
            }
        }
        Ok(())
    }
}
