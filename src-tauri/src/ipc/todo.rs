//! Tauri IPC commands to bridge the Todo Backend Model Controller with Client side.

use super::IpcResponse;
use crate::ctx::Ctx;
use crate::model::{ModelDeleteResultData, Todo, TodoBmc, TodoForCreate, TodoForUpdate};
use crate::prelude::*;
use tauri::{command, AppHandle, Wry};

#[command]
pub async fn get_todo(app: AppHandle<Wry>, id: String) -> IpcResponse<Todo> {
    match Ctx::from_app(app) {
        Ok(ctx) => TodoBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_todos(app: AppHandle<Wry>) -> IpcResponse<Vec<Todo>> {
    match Ctx::from_app(app) {
        Ok(ctx) => TodoBmc::list(ctx.get_store()).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_todo(app: AppHandle<Wry>, data: TodoForCreate) -> IpcResponse<Todo> {
    match Ctx::from_app(app) {
        Ok(ctx) => TodoBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_todo(
    app: AppHandle<Wry>,
    id: String,
    data: TodoForUpdate,
) -> IpcResponse<Todo> {
    match Ctx::from_app(app) {
        Ok(ctx) => TodoBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_todo(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => TodoBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
