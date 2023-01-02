use tauri::{command, AppHandle, Manager, Wry};

use crate::{prelude::Result, state::State};

#[command]
pub async fn get_active_intent_id(
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<String>> {
    Ok(state.try_lock().unwrap().active_intent_id.clone())
}

#[command]
pub async fn set_active_intent_id(
    data: Option<String>,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<String>> {
    let mut state = state.try_lock().unwrap();

    state.active_intent_id = data;

    app.emit_all("active_intent_id_updated", state.clone())
        .unwrap();

    Ok(state.active_intent_id.clone())
}
