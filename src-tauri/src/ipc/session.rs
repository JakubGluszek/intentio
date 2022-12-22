//! Tauri IPC commands to bridge the Focused Backend Model Controller with Client side.

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{Session, SessionBmc, SessionForCreate},
    prelude::{Error, Result},
};

#[command]
pub async fn get_sessions(app: AppHandle<Wry>) -> Result<Vec<Session>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match SessionBmc::get_multi(ctx).await {
            Ok(sessions) => Ok(sessions),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_session(app: AppHandle<Wry>, data: SessionForCreate) -> Result<Session> {
    match Ctx::from_app(app) {
        Ok(ctx) => match SessionBmc::create(ctx, data).await {
            Ok(session) => Ok(session),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
