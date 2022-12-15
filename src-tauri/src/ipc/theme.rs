//! Tauri IPC commands to bridge the Theme Backend Model Controller with Client side.

use super::IpcResponse;
use crate::model::{ModelDeleteResultData, SettingsBmc, ThemeBmc, ThemeForCreate, ThemeForUpdate};
use crate::prelude::Error;
use crate::{ctx::Ctx, model::Theme};
use tauri::{command, AppHandle, Wry};

#[command]
pub async fn get_current_theme(app: AppHandle<Wry>) -> Result<Theme, ()> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let settings = SettingsBmc::get().unwrap();
            match ThemeBmc::get(ctx, &settings.current_theme_id).await {
                Ok(theme) => Ok(theme),
                Err(_) => Err(()),
            }
        }
        Err(_) => Err(()),
    }
}

#[command]
pub async fn get_theme(app: AppHandle<Wry>, id: String) -> IpcResponse<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => ThemeBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_themes(app: AppHandle<Wry>) -> IpcResponse<Vec<Theme>> {
    match Ctx::from_app(app) {
        Ok(ctx) => ThemeBmc::list(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_theme(app: AppHandle<Wry>, data: ThemeForCreate) -> IpcResponse<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => ThemeBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_theme(
    app: AppHandle<Wry>,
    id: String,
    data: ThemeForUpdate,
) -> IpcResponse<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => ThemeBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_theme(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => ThemeBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
