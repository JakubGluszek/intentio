use std::sync::Mutex;

use tauri::{command, AppHandle, Manager};

use crate::{
    config::{ConfigManager, SettingsConfig},
    models::Theme,
    prelude::Result,
    state::{AppState, SessionType, TimerStateForUpdate},
};

#[command]
pub async fn get_current_theme(state: tauri::State<'_, Mutex<AppState>>) -> Result<Theme> {
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
pub async fn set_current_theme(
    data: Theme,
    state: tauri::State<'_, Mutex<AppState>>,
    app_handle: AppHandle,
) -> Result<()> {
    let mut state = state.lock().unwrap();

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

    app_handle.emit_all("current_theme_updated", data)?;
    Ok(())
}

#[command]
pub async fn update_timer_state(
    data: TimerStateForUpdate,
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<()> {
    let mut state = state.lock().unwrap();

    if let Some(session_type) = data.session_type {
        state.timer.session_type = session_type;
    }
    if let Some(is_playing) = data.is_playing {
        state.timer.is_playing = is_playing;
    }

    state.update_current_theme(app_handle)?;

    Ok(())
}

#[command]
pub async fn set_idle_theme(
    data: Theme,
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<()> {
    // update settings config
    let mut settings = ConfigManager::get::<SettingsConfig>()?;
    settings.idle_theme_id = data.id.clone();
    ConfigManager::save::<SettingsConfig>(&settings)?;

    app_handle.emit_all("settings_config_updated", settings)?;

    // update state
    let mut state = state.lock().unwrap();
    state.idle_theme = data;
    state.update_current_theme(app_handle)?;

    Ok(())
}

#[command]
pub async fn set_focus_theme(
    data: Theme,
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<()> {
    // update settings config
    let mut settings = ConfigManager::get::<SettingsConfig>()?;
    settings.focus_theme_id = data.id.clone();
    ConfigManager::save::<SettingsConfig>(&settings)?;

    app_handle.emit_all("settings_config_updated", settings)?;

    // update state
    let mut state = state.lock().unwrap();
    state.focus_theme = data;
    state.update_current_theme(app_handle)?;

    Ok(())
}

#[command]
pub async fn set_break_theme(
    data: Theme,
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<()> {
    // update settings config
    let mut settings = ConfigManager::get::<SettingsConfig>()?;
    settings.break_theme_id = data.id.clone();
    ConfigManager::save::<SettingsConfig>(&settings)?;

    app_handle.emit_all("settings_config_updated", settings)?;

    // update state
    let mut state = state.lock().unwrap();
    state.break_theme = data;
    state.update_current_theme(app_handle)?;

    Ok(())
}

#[command]
pub async fn set_long_break_theme(
    data: Theme,
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<AppState>>,
) -> Result<()> {
    // update settings config
    let mut settings = ConfigManager::get::<SettingsConfig>()?;
    settings.long_break_theme_id = data.id.clone();
    ConfigManager::save::<SettingsConfig>(&settings)?;

    app_handle.emit_all("settings_config_updated", settings)?;

    // update state
    let mut state = state.lock().unwrap();
    state.long_break_theme = data;
    state.update_current_theme(app_handle)?;

    Ok(())
}
