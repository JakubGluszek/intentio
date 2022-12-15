//! Tauri IPC commands to bridge the Project Backend Model Controller with Client side.

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{Intent, IntentBmc, IntentForCreate, IntentForUpdate, ModelDeleteResultData},
    prelude::Error,
};

use super::IpcResponse;

#[command]
pub async fn get_intent(app: AppHandle<Wry>, id: String) -> IpcResponse<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => IntentBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_intents(app: AppHandle<Wry>) -> IpcResponse<Vec<Intent>> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let projects = IntentBmc::list(ctx.get_store()).await;

            projects.into()
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_intent(app: AppHandle<Wry>, data: IntentForCreate) -> IpcResponse<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => IntentBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_intent(
    app: AppHandle<Wry>,
    id: String,
    data: IntentForUpdate,
) -> IpcResponse<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => IntentBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_intent(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => IntentBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
