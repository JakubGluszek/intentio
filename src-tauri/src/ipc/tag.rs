//! Tauri IPC commands to bridge the Tag Backend Model Controller with client side.

use tauri::{command, AppHandle, Manager};

use crate::{
    bmc::TagBmc,
    ctx::AppContext,
    models::{CreateTag, Tag, UpdateTag},
    prelude::Result,
};

#[command]
pub async fn create_tag(app_handle: AppHandle, data: CreateTag) -> Result<i32> {
    let id = app_handle.db(|mut db| TagBmc::create(&mut db, &data))?;
    app_handle.emit_all("tag_created", id)?;
    Ok(id)
}

#[command]
pub async fn update_tag(app_handle: AppHandle, id: i32, data: UpdateTag) -> Result<i32> {
    let id = app_handle.db(|mut db| TagBmc::update(&mut db, id, &data))?;
    app_handle.emit_all("tag_updated", id)?;
    Ok(id)
}

#[command]
pub async fn delete_tag(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| TagBmc::delete(&mut db, id))?;
    app_handle.emit_all("tag_deleted", id)?;
    Ok(id)
}

#[command]
pub async fn get_tag(app_handle: AppHandle, id: i32) -> Result<Tag> {
    app_handle.db(|mut db| TagBmc::get(&mut db, id))
}

#[command]
pub async fn get_tags(app_handle: AppHandle) -> Result<Vec<Tag>> {
    app_handle.db(|mut db| TagBmc::get_list(&mut db))
}
