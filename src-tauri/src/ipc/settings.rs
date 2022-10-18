//! Tauri IPC commands to bridge Project Backend Model Controller with Frontend

use super::IpcResponse;
use crate::ctx::Ctx;
use crate::model::{Settings, SettingsBmc, SettingsForUpdate};
use crate::prelude::*;
use tauri::{command, AppHandle, Wry};

#[command]
pub async fn get_settings(app: AppHandle<Wry>) -> IpcResponse<Settings> {
    match Ctx::from_app(app) {
        Ok(ctx) => SettingsBmc::get(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_settings(
    app: AppHandle<Wry>,
    data: SettingsForUpdate,
) -> IpcResponse<Settings> {
    match Ctx::from_app(app) {
        Ok(ctx) => SettingsBmc::update(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
