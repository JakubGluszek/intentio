use tauri::{command, AppHandle};
use tokio::sync::Mutex;

use crate::{
    models::Intent,
    prelude::Result,
    timer::{Queue, QueueSession, Timer, TimerSession},
};

#[command]
pub async fn timer_get_session(state: tauri::State<'_, Mutex<Timer>>) -> Result<TimerSession> {
    let timer = state.lock().await;
    let session = timer.get_session().await?;
    Ok(session)
}

#[command]
pub async fn timer_set_session_intent(
    app_handle: AppHandle,
    state: tauri::State<'_, Mutex<Timer>>,
    intent: Intent,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.set_session_intent(app_handle, intent).await;
    Ok(())
}

#[command]
pub async fn timer_play(state: tauri::State<'_, Mutex<Timer>>) -> Result<()> {
    let mut timer = state.lock().await;
    timer.play().await?;
    Ok(())
}

#[command]
pub async fn timer_stop(state: tauri::State<'_, Mutex<Timer>>) -> Result<()> {
    let mut timer = state.lock().await;
    timer.stop().await?;
    Ok(())
}

#[command]
pub async fn timer_restart(state: tauri::State<'_, Mutex<Timer>>) -> Result<()> {
    let mut timer = state.lock().await;
    timer.restart().await?;
    Ok(())
}

#[command]
pub async fn timer_skip(state: tauri::State<'_, Mutex<Timer>>) -> Result<()> {
    let mut timer = state.lock().await;
    timer.skip().await?;
    Ok(())
}

#[command]
pub async fn timer_get_queue(state: tauri::State<'_, Mutex<Timer>>) -> Result<Queue> {
    let timer = state.lock().await;
    let queue = timer.get_queue().await;
    Ok(queue)
}

#[command]
pub async fn timer_add_to_queue(
    state: tauri::State<'_, Mutex<Timer>>,
    data: QueueSession,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.add_to_queue(data).await;
    Ok(())
}

#[command]
pub async fn timer_remove_from_queue(
    state: tauri::State<'_, Mutex<Timer>>,
    idx: usize,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.remove_from_queue(idx).await;
    Ok(())
}

#[command]
pub async fn timer_reorder_queue(
    state: tauri::State<'_, Mutex<Timer>>,
    idx: usize,
    target_idx: usize,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.reorder_queue(idx, target_idx).await;
    Ok(())
}

#[command]
pub async fn timer_clear_queue(state: tauri::State<'_, Mutex<Timer>>) -> Result<()> {
    let mut timer = state.lock().await;
    timer.clear_queue().await;
    Ok(())
}

#[command]
pub async fn timer_increment_queue_session_iterations(
    state: tauri::State<'_, Mutex<Timer>>,
    idx: usize,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.increment_queue_session_iterations(idx).await;
    Ok(())
}

#[command]
pub async fn timer_decrement_queue_session_iterations(
    state: tauri::State<'_, Mutex<Timer>>,
    idx: usize,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.decrement_queue_session_iterations(idx).await;
    Ok(())
}

#[command]
pub async fn timer_update_queue_session_duration(
    state: tauri::State<'_, Mutex<Timer>>,
    idx: usize,
    duration: i64,
) -> Result<()> {
    let mut timer = state.lock().await;
    timer.update_queue_session_duration(idx, duration).await;
    Ok(())
}
