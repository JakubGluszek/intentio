//! Tauri IPC commands to bridge the Script Backend Model Controller with client side.

use tauri::{command, AppHandle};

use crate::{
    ctx::AppContext,
    db::{CreateScript, Script, ScriptBmc, UpdateScript},
    prelude::Result,
};

#[command]
pub async fn create_script(app_handle: AppHandle, data: CreateScript) -> Result<i32> {
    app_handle.db(|mut db| ScriptBmc::create(&mut db, &data))
}

#[command]
pub async fn update_script(app_handle: AppHandle, id: i32, data: UpdateScript) -> Result<i32> {
    app_handle.db(|mut db| ScriptBmc::update(&mut db, id, &data))
}

#[command]
pub async fn delete_script(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| ScriptBmc::delete(&mut db, id))
}

#[command]
pub async fn get_script(app_handle: AppHandle, id: i32) -> Result<Script> {
    app_handle.db(|mut db| ScriptBmc::get(&mut db, id))
}

#[command]
pub async fn get_scripts(app_handle: AppHandle) -> Result<Vec<Script>> {
    app_handle.db(|mut db| ScriptBmc::get_list(&mut db))
}
