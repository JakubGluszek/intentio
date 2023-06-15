use tauri::{command, AppHandle};

use crate::{ctx::AppContext, prelude::Result};

#[command]
pub async fn timer_play(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.play());
    Ok(())
}

#[command]
pub async fn timer_stop(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.stop());
    Ok(())
}

#[command]
pub async fn timer_restart(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.restart());
    Ok(())
}

#[command]
pub async fn timer_skip(app_handle: AppHandle) -> Result<()> {
    app_handle.timer(|timer| timer.skip());
    Ok(())
}

#[command]
pub async fn timer_set_intent(app_handle: AppHandle, id: i32) -> Result<()> {
    app_handle.timer(|timer| timer.set_intent_id(id));
    Ok(())
}
