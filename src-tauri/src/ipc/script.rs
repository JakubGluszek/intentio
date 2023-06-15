//! Tauri IPC commands to bridge the Script Backend Model Controller with client side.

use tauri::{command, AppHandle, Manager};

use crate::{
    bmc::ScriptBmc,
    ctx::AppContext,
    models::{CreateScript, Script, UpdateScript},
    prelude::Result,
};

use super::EventPayload;

#[command]
pub async fn create_script(app_handle: AppHandle, data: CreateScript) -> Result<i32> {
    let id = app_handle.db(|mut db| ScriptBmc::create(&mut db, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("script_created", payload)?;
    Ok(id)
}

#[command]
pub async fn update_script(app_handle: AppHandle, id: i32, data: UpdateScript) -> Result<i32> {
    let id = app_handle.db(|mut db| ScriptBmc::update(&mut db, id, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("script_updated", payload)?;
    Ok(id)
}

#[command]
pub async fn delete_script(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| ScriptBmc::delete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("script_deleted", payload)?;
    Ok(id)
}

#[command]
pub async fn get_script(app_handle: AppHandle, id: i32) -> Result<Script> {
    app_handle.db(|mut db| ScriptBmc::get(&mut db, id))
}

#[command]
pub async fn get_scripts(app_handle: AppHandle) -> Result<Vec<Script>> {
    app_handle.db(|mut db| ScriptBmc::get_list(&mut db))
}
