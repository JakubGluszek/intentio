//! Tauri IPC commands to bridge the Intent Backend Model Controller with client side.

use tauri::{command, AppHandle};

use crate::{
    ctx::AppContext,
    db::{CreateIntent, Intent, IntentBmc, UpdateIntent},
    prelude::Result,
};

#[command]
pub async fn create_intent(app_handle: AppHandle, data: CreateIntent) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::create(&mut db, &data))?;
    Ok(id)
}

#[command]
pub async fn update_intent(app_handle: AppHandle, id: i32, data: UpdateIntent) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::update(&mut db, id, &data))?;
    Ok(id)
}

#[command]
pub async fn delete_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::delete(&mut db, id))?;
    Ok(id)
}

#[command]
pub async fn get_intent(app_handle: AppHandle, id: i32) -> Result<Intent> {
    let intent = app_handle.db(|mut db| IntentBmc::get(&mut db, id))?;
    Ok(intent)
}

#[command]
pub async fn get_intents(app_handle: AppHandle) -> Result<Vec<Intent>> {
    let intents = app_handle.db(|mut db| IntentBmc::get_list(&mut db))?;
    Ok(intents)
}

#[command]
pub async fn archive_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| IntentBmc::archive(&mut db, id))
}

#[command]
pub async fn unarchive_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| IntentBmc::unarchive(&mut db, id))
}
