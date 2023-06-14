//! Tauri IPC commands to bridge the Theme Backend Model Controller with client side.

use tauri::{command, AppHandle};

use crate::{
    ctx::AppContext,
    db::{CreateTheme, Theme, ThemeBmc, UpdateTheme},
    prelude::Result,
};

#[command]
pub async fn create_theme(app_handle: AppHandle, data: CreateTheme) -> Result<i32> {
    app_handle.db(|mut db| ThemeBmc::create(&mut db, &data))
}

#[command]
pub async fn update_theme(app_handle: AppHandle, id: i32, data: UpdateTheme) -> Result<i32> {
    app_handle.db(|mut db| ThemeBmc::update(&mut db, id, &data))
}

#[command]
pub async fn delete_theme(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| ThemeBmc::delete(&mut db, id))
}

#[command]
pub async fn get_theme(app_handle: AppHandle, id: i32) -> Result<Theme> {
    app_handle.db(|mut db| ThemeBmc::get(&mut db, id))
}

#[command]
pub async fn get_themes(app_handle: AppHandle) -> Result<Vec<Theme>> {
    app_handle.db(|mut db| ThemeBmc::get_list(&mut db))
}
