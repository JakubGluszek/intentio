use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    prelude::Result,
    state::{State, StateForUpdate},
};

#[command]
pub async fn get_state(state: tauri::State<'_, tokio::sync::Mutex<State>>) -> Result<State> {
    Ok(state.try_lock().unwrap().clone())
}

#[command]
pub async fn update_state(
    data: StateForUpdate,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<State> {
    let mut state = state.try_lock().unwrap();

    if let Some(session_queue) = data.session_queue {
        state.session_queue = session_queue;
    }

    if let Some(active_intent) = data.active_intent {
        state.active_intent = active_intent;
    }

    app.emit_all("state_updated", state.clone()).unwrap();

    Ok(state.clone())
}
