//! Tauri IPC commands to bridge the Focused Backend Model Controller with Client side.

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{Session, SessionBmc, SessionForCreate},
    prelude::Error,
};

use super::IpcResponse;

#[command]
pub async fn get_sessions(app: AppHandle<Wry>) -> IpcResponse<Vec<Session>> {
    match Ctx::from_app(app) {
        Ok(ctx) => SessionBmc::get_multi(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_session(app: AppHandle<Wry>, data: SessionForCreate) -> IpcResponse<Session> {
    match Ctx::from_app(app) {
        Ok(ctx) => SessionBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
