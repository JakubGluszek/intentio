use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    model::Project,
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
pub async fn get_current_project(
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<Project>, ()> {
    Ok(state.try_lock().unwrap().current_project.clone())
}

#[command]
pub async fn set_current_project(
    data: Option<Project>,
    app: AppHandle<Wry>,
    state: tauri::State<'_, tokio::sync::Mutex<State>>,
) -> Result<Option<Project>, ()> {
    let mut state = state.try_lock().unwrap();

    state.current_project = data;

    app.emit_all("current_project_updated", state.current_project.clone())
        .unwrap();

    Ok(state.current_project.clone())
}
