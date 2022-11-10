use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{
        ModelDeleteResultData, QueueSession, QueueSessionBmc, QueueSessionForCreate,
        QueueSessionForUpdate,
    },
    prelude::Error,
};

use super::IpcResponse;

#[command]
pub async fn create_queue_session(
    app: AppHandle<Wry>,
    data: QueueSessionForCreate,
) -> IpcResponse<QueueSession> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueSessionBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_queue_session(app: AppHandle<Wry>, id: String) -> IpcResponse<QueueSession> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueSessionBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_queue_session(
    app: AppHandle<Wry>,
    id: String,
    data: QueueSessionForUpdate,
) -> IpcResponse<QueueSession> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueSessionBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_queue_session(
    app: AppHandle<Wry>,
    id: String,
) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueSessionBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_queue_sessions(app: AppHandle<Wry>) -> IpcResponse<Vec<QueueSession>> {
    match Ctx::from_app(app) {
        Ok(ctx) => QueueSessionBmc::list(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
