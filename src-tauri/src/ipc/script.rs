use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    models::{ModelDeleteResultData, Script, ScriptBmc, ScriptForCreate, ScriptForUpdate},
    prelude::{Error, Result},
};

#[command]
pub async fn get_scripts(app: AppHandle<Wry>) -> Result<Vec<Script>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ScriptBmc::get_multi(ctx).await {
            Ok(scripts) => Ok(scripts),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_script(app: AppHandle<Wry>, data: ScriptForCreate) -> Result<Script> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ScriptBmc::create(ctx, data).await {
            Ok(script) => Ok(script),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_script(
    app: AppHandle<Wry>,
    id: String,
    data: ScriptForUpdate,
) -> Result<Script> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ScriptBmc::update(ctx, &id, data).await {
            Ok(script) => Ok(script),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_script(app: AppHandle<Wry>, id: String) -> Result<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ScriptBmc::delete(ctx, &id).await {
            Ok(data) => Ok(data),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
