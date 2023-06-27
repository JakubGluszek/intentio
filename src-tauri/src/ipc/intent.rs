//! Tauri IPC commands to bridge the Intent Backend Model Controller with client side.

use tauri::{command, AppHandle, Manager};

use crate::{
    bmc::IntentBmc,
    ctx::AppContext,
    models::{CreateIntent, Intent, Tag, UpdateIntent},
    prelude::Result,
};

use super::EventPayload;

#[command]
pub async fn create_intent(app_handle: AppHandle, data: CreateIntent) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::create(&mut db, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("intent_created", payload)?;
    Ok(id)
}

#[command]
pub async fn update_intent(app_handle: AppHandle, id: i32, data: UpdateIntent) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::update(&mut db, id, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("intent_updated", payload)?;
    Ok(id)
}

#[command]
pub async fn delete_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::delete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("intent_deleted", payload)?;
    Ok(id)
}

#[command]
pub async fn get_intent(app_handle: AppHandle, id: i32) -> Result<Intent> {
    app_handle.db(|mut db| IntentBmc::get(&mut db, id))
}

#[command]
pub async fn get_intents(app_handle: AppHandle) -> Result<Vec<Intent>> {
    app_handle.db(|mut db| IntentBmc::get_list(&mut db))
}

#[command]
pub async fn archive_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::archive(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("intent_archived", payload)?;
    Ok(id)
}

#[command]
pub async fn unarchive_intent(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| IntentBmc::unarchive(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("intent_unarchived", payload)?;
    Ok(id)
}

#[command]
pub async fn get_intent_tags(app_handle: AppHandle, id: i32) -> Result<Vec<Tag>> {
    app_handle.db(|mut db| IntentBmc::get_tags(&mut db, id))
}
