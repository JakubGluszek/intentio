use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{ModelDeleteResultData, Queue, QueueBmc, QueueForCreate, QueueForUpdate},
    prelude::Error,
};

use super::IpcResponse;

#[command]
pub async fn create_queue(app: AppHandle<Wry>, data: QueueForCreate) -> IpcResponse<Queue> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_queue(app: AppHandle<Wry>, id: String) -> IpcResponse<Queue> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_queues(app: AppHandle<Wry>) -> IpcResponse<Vec<Queue>> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueBmc::list(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_queue(
    app: AppHandle<Wry>,
    id: String,
    data: QueueForUpdate,
) -> IpcResponse<Queue> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_queue(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
