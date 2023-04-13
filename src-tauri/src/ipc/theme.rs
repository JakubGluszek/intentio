//! Tauri IPC commands to bridge the Theme Backend models Controller with Client side.

use crate::cfg::InterfaceCfg;
use crate::models::{ModelDeleteResultData, ThemeBmc, ThemeForCreate, ThemeForUpdate};
use crate::prelude::{
    Error, Result, BREAK_THEME_ID, FOCUS_THEME_ID, IDLE_THEME_ID, LONG_BREAK_THEME_ID,
};
use crate::state::AppState;
use crate::{ctx::Ctx, models::Theme};
use tauri::{command, AppHandle, Wry};

#[command]
pub async fn get_theme(app: AppHandle<Wry>, id: String) -> Result<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::get(ctx, &id).await {
            Ok(theme) => Ok(theme),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_themes(app: AppHandle<Wry>) -> Result<Vec<Theme>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::list(ctx).await {
            Ok(themes) => Ok(themes),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_theme(app: AppHandle<Wry>, data: ThemeForCreate) -> Result<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::create(ctx, data).await {
            Ok(theme) => Ok(theme),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_theme(app: AppHandle<Wry>, id: String, data: ThemeForUpdate) -> Result<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::update(ctx, &id, data).await {
            Ok(theme) => Ok(theme),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_theme(
    app: AppHandle<Wry>,
    id: String,
    state: tauri::State<'_, tokio::sync::Mutex<AppState>>,
) -> Result<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::delete(ctx.clone(), &id).await {
            Ok(data) => {
                let mut state = state.lock().await;
                if state.idle_theme.id == id {
                    let theme = ThemeBmc::get(ctx.clone(), IDLE_THEME_ID).await.unwrap();
                    state.idle_theme = theme;
                    InterfaceCfg::set_idle_theme_id(ctx.clone(), IDLE_THEME_ID.to_string());
                } else if state.focus_theme.id == id {
                    let theme = ThemeBmc::get(ctx.clone(), FOCUS_THEME_ID).await.unwrap();
                    state.focus_theme = theme;
                    InterfaceCfg::set_focus_theme_id(ctx.clone(), FOCUS_THEME_ID.to_string());
                } else if state.break_theme.id == id {
                    let theme = ThemeBmc::get(ctx.clone(), BREAK_THEME_ID).await.unwrap();
                    state.break_theme = theme;
                    InterfaceCfg::set_break_theme_id(ctx.clone(), BREAK_THEME_ID.to_string());
                } else if state.long_break_theme.id == id {
                    let theme = ThemeBmc::get(ctx.clone(), LONG_BREAK_THEME_ID)
                        .await
                        .unwrap();
                    state.long_break_theme = theme;
                    InterfaceCfg::set_long_break_theme_id(
                        ctx.clone(),
                        LONG_BREAK_THEME_ID.to_string(),
                    );
                }
                state.update_current_theme(ctx);
                Ok(data)
            }
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_themes(
    app: AppHandle<Wry>,
    ids: Vec<String>,
) -> Result<Vec<ModelDeleteResultData>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match ThemeBmc::delete_multi(ctx, ids).await {
            Ok(data) => Ok(data),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
