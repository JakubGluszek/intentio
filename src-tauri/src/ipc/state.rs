use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    model::Intent,
    state::{SessionQueue, State},
};

#[command]
pub async fn get_session_queue(
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<SessionQueue>, ()> {
    Ok(state.try_lock().unwrap().session_queue.clone())
}

#[command]
pub async fn set_session_queue(
    data: Option<SessionQueue>,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<SessionQueue>, ()> {
    let mut state = state.try_lock().unwrap();

    state.session_queue = data;

    app.emit_all("set_session_queue", state.session_queue.clone())
        .unwrap();

    Ok(state.session_queue.clone())
}

#[command]
pub async fn get_active_intent(
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<Intent>, ()> {
    Ok(state.try_lock().unwrap().active_intent.clone())
}

#[command]
pub async fn set_active_intent(
    data: Option<Intent>,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<Intent>, ()> {
    let mut state = state.try_lock().unwrap();

    state.active_intent = data;

    app.emit_all("active_intent_updated", state.active_intent.clone())
        .unwrap();

    Ok(state.active_intent.clone())
}
