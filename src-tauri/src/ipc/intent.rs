//! Tauri IPC commands to bridge the Project Backend models Controller with Client side.

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    models::{Intent, IntentBmc, IntentForCreate, IntentForUpdate, ModelDeleteResultData},
    prelude::{Error, Result},
};

#[command]
pub async fn get_intents(app: AppHandle<Wry>) -> Result<Vec<Intent>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::list(ctx.get_database()).await {
            Ok(intents) => Ok(intents),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_intent(app: AppHandle<Wry>, data: IntentForCreate) -> Result<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::create(ctx, data).await {
            Ok(intent) => Ok(intent),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_intent(
    app: AppHandle<Wry>,
    id: String,
    data: IntentForUpdate,
) -> Result<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::update(ctx, &id, data).await {
            Ok(intent) => Ok(intent),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_intent(app: AppHandle<Wry>, id: String) -> Result<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::delete(ctx, &id).await {
            Ok(data) => Ok(data),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn archive_intent(app: AppHandle<Wry>, id: String) -> Result<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::archive(ctx, &id).await {
            Ok(intent) => Ok(intent),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn unarchive_intent(app: AppHandle<Wry>, id: String) -> Result<Intent> {
    match Ctx::from_app(app) {
        Ok(ctx) => match IntentBmc::unarchive(ctx, &id).await {
            Ok(intent) => Ok(intent),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
