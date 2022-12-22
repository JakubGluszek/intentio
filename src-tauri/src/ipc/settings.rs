//! Tauri IPC commands to bridge the Todo Backend Model Controller with Client side.

use crate::ctx::Ctx;
use crate::model::{Settings, SettingsBmc, SettingsForUpdate};
use crate::prelude::{Error, Result};
use tauri::{command, AppHandle, Wry};

#[command]
pub async fn get_settings(app: AppHandle<Wry>) -> Result<Settings> {
    match Ctx::from_app(app) {
        Ok(_) => match SettingsBmc::get() {
            Ok(settings) => Ok(settings),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_settings(app: AppHandle<Wry>, data: SettingsForUpdate) -> Result<Settings> {
    match Ctx::from_app(app) {
        Ok(ctx) => match SettingsBmc::update(ctx, data) {
            Ok(settings) => Ok(settings),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
