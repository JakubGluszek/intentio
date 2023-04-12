use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    cfg::InterfaceCfg,
    ctx::Ctx,
    models::Theme,
    state::{update_current_theme, AppState, SessionType, TimerStateForUpdate},
};

#[command]
pub async fn get_current_theme(
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<Theme, ()> {
    let state = state.lock().await;

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
pub async fn set_current_theme(
    data: Theme,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
    app: AppHandle<Wry>,
) -> Result<(), ()> {
    if let Ok(ctx) = Ctx::from_app(app) {
        let mut state = state.lock().await;

        if state.timer.is_playing == false {
            state.idle_theme = data.clone();
        } else {
            match state.timer.session_type {
                SessionType::Focus => {
                    state.focus_theme = data.clone();
                }
                SessionType::Break => {
                    state.break_theme = data.clone();
                }
                SessionType::LongBreak => {
                    state.long_break_theme = data.clone();
                }
            }
        }
        ctx.emit_event("current_theme_updated", data);
    }

    Ok(())
}

#[command]
pub async fn update_timer_state(
    data: TimerStateForUpdate,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<(), ()> {
    let mut state = state.lock().await;

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

#[command]
pub async fn set_idle_theme(
    data: Theme,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<(), ()> {
    if let Ok(ctx) = Ctx::from_app(app.app_handle()) {
        InterfaceCfg::set_idle_theme_id(ctx.clone(), data.id.clone());

        let mut state = state.lock().await;
        state.idle_theme = data;

        update_current_theme(ctx, &state);
    }
    Ok(())
}

#[command]
pub async fn set_focus_theme(
    data: Theme,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<(), ()> {
    if let Ok(ctx) = Ctx::from_app(app.app_handle()) {
        InterfaceCfg::set_focus_theme_id(ctx.clone(), data.id.clone());

        let mut state = state.lock().await;
        state.focus_theme = data;

        update_current_theme(ctx, &state);
    }
    Ok(())
}

#[command]
pub async fn set_break_theme(
    data: Theme,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<(), ()> {
    if let Ok(ctx) = Ctx::from_app(app.app_handle()) {
        InterfaceCfg::set_break_theme_id(ctx.clone(), data.id.clone());

        let mut state = state.lock().await;
        state.break_theme = data;

        update_current_theme(ctx, &state);
    }
    Ok(())
}

#[command]
pub async fn set_long_break_theme(
    data: Theme,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<(), ()> {
    if let Ok(ctx) = Ctx::from_app(app.app_handle()) {
        InterfaceCfg::set_long_break_theme_id(ctx.clone(), data.id.clone());

        let mut state = state.lock().await;
        state.long_break_theme = data;

        update_current_theme(ctx, &state);
    }
    Ok(())
}
