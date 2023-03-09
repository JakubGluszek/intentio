use std::sync::Mutex;

use tauri::command;

use crate::{
    prelude::Result,
    state::{State, TimerSession},
};

#[command]
pub async fn get_timer_session(state: tauri::State<'_, Mutex<State>>) -> Result<TimerSession> {
    let session = state.lock().unwrap().session.clone();
    Ok(session)
}

#[command]
pub async fn set_timer_session(
    data: TimerSession,
    state: tauri::State<'_, Mutex<State>>,
) -> Result<TimerSession> {
    let mut state = state.lock().unwrap();

    state.session = data;

    Ok(state.session.clone())
}
