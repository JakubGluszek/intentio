use tauri::{command, AppHandle};

use crate::{
    ctx::AppContext,
    prelude::Result,
    timer::{CreateTimerSession, QueueSession},
};

#[command]
pub async fn timer_get_session(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.get_session())?;
    Ok(())
}

#[command]
pub async fn timer_set_session(app_handle: AppHandle, data: CreateTimerSession) -> Result<()> {
    app_handle.timer(|timer| timer.set_session(data));
    Ok(())
}

#[command]
pub async fn timer_play(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.play())?;
    Ok(())
}

#[command]
pub async fn timer_stop(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.stop())?;
    Ok(())
}

#[command]
pub async fn timer_restart(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.restart())?;
    Ok(())
}

#[command]
pub async fn timer_skip(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.skip())?;
    Ok(())
}

#[command]
pub async fn timer_add_to_queue(app_handle: AppHandle, data: QueueSession) -> Result<()> {
    app_handle.timer(|timer| timer.add_to_queue(data));
    Ok(())
}

#[command]
pub async fn timer_remove_from_queue(app_handle: AppHandle, idx: usize) -> Result<()> {
    app_handle.timer(|timer| timer.remove_from_queue(idx));
    Ok(())
}

#[command]
pub async fn timer_reorder_queue(
    app_handle: AppHandle,
    idx: usize,
    target_idx: usize,
) -> Result<()> {
    app_handle.timer(|timer| timer.reorder_queue(idx, target_idx));
    Ok(())
}

#[command]
pub async fn timer_clear_queue(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.clear_queue());
    Ok(())
}

#[command]
pub async fn timer_increment_queue_session_iterations(
    app_handle: AppHandle,
    idx: usize,
) -> Result<()> {
    app_handle.timer(|timer| timer.increment_queue_session_iterations(idx));
    Ok(())
}

#[command]
pub async fn timer_decrement_queue_session_iterations(
    app_handle: AppHandle,
    idx: usize,
) -> Result<()> {
    app_handle.timer(|timer| timer.decrement_queue_session_iterations(idx));
    Ok(())
}

#[command]
pub async fn timer_update_queue_session_duration(
    app_handle: AppHandle,
    idx: usize,
    duration: u32,
) -> Result<()> {
    app_handle.timer(|timer| timer.update_queue_session_duration(idx, duration));
    Ok(())
}
