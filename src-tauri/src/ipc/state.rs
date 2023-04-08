use std::sync::{Arc, Mutex};

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    models::Theme,
    state::{AppState, SessionType, TimerStateForUpdate},
};

#[command]
pub async fn get_current_theme(state: tauri::State<'_, Mutex<AppState>>) -> Result<Theme, ()> {
    let state = state.lock().unwrap();

    if state.timer.is_playing == false {
        return Ok(state.idle_theme.clone());
    } else {
        match state.timer.session_type {
            SessionType::Focus => Ok(state.focus_theme.clone()),
            SessionType::Break => Ok(state.break_theme.clone()),
            SessionType::LongBreak => Ok(state.long_break_theme.clone()),
        }
    }
}

#[command]
pub async fn update_timer_state(
    data: TimerStateForUpdate,
    app: AppHandle<Wry>,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<(), ()> {
    let mut state = state.lock().unwrap();

    if let Some(session_type) = data.session_type {
        state.timer.session_type = session_type;
    }
    if let Some(is_playing) = data.is_playing {
        state.timer.is_playing = is_playing;
    }

    if let Ok(ctx) = Ctx::from_app(app) {
        update_current_theme(ctx, &state);
    }

    Ok(())
}

fn update_current_theme(ctx: Arc<Ctx>, state: &AppState) {
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
