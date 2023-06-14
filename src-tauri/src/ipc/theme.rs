//! Tauri IPC commands to bridge the Theme Backend Model Controller with client side.

use tauri::{command, AppHandle, Manager};

use crate::{
    bmc::ThemeBmc,
    ctx::AppContext,
    models::{CreateTheme, Theme, UpdateTheme},
    prelude::Result,
};

use super::EventPayload;

#[command]
pub async fn create_theme(app_handle: AppHandle, data: CreateTheme) -> Result<i32> {
    let id = app_handle.db(|mut db| ThemeBmc::create(&mut db, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("theme_created", payload)?;
    Ok(id)
}

#[command]
pub async fn update_theme(app_handle: AppHandle, id: i32, data: UpdateTheme) -> Result<i32> {
    let id = app_handle.db(|mut db| ThemeBmc::update(&mut db, id, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("theme_updated", payload)?;
    Ok(id)
}

#[command]
pub async fn delete_theme(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| ThemeBmc::delete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("theme_deleted", payload)?;
    Ok(id)
}

#[command]
pub async fn get_theme(app_handle: AppHandle, id: i32) -> Result<Theme> {
    app_handle.db(|mut db| ThemeBmc::get(&mut db, id))
}

#[command]
pub async fn get_themes(app_handle: AppHandle) -> Result<Vec<Theme>> {
    app_handle.db(|mut db| ThemeBmc::get_list(&mut db))
}
