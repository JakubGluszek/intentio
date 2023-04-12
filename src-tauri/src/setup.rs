use std::{fs, path::Path};

use tauri::{App, AppHandle, Manager};

use crate::{
    cfg::{AudioCfg, BehaviorCfg, InterfaceCfg, TimerCfg},
    ctx::Ctx,
    models::ThemeBmc,
    state::{AppState, TimerState},
    utils,
};

pub async fn init_setup(app: &mut App) {
    setup_config_dir();

    TimerCfg::setup();
    AudioCfg::setup();
    BehaviorCfg::setup();
    InterfaceCfg::setup();

    setup_state(app).await;
    build_main_window(&app.app_handle());
}

fn setup_config_dir() {
    let path = utils::get_config_path();

    if !Path::new(&path).is_dir() {
        fs::create_dir(path).unwrap();
    }
}

async fn setup_state(app: &mut App) {
    let timer = TimerState::default();

    if let Ok(ctx) = Ctx::from_app(app.app_handle()) {
        let interface_cfg = InterfaceCfg::get();

        let idle_theme = ThemeBmc::get(ctx.clone(), &interface_cfg.idle_theme_id)
            .await
            .unwrap();
        let focus_theme = ThemeBmc::get(ctx.clone(), &interface_cfg.focus_theme_id)
            .await
            .unwrap();
        let break_theme = ThemeBmc::get(ctx.clone(), &interface_cfg.break_theme_id)
            .await
            .unwrap();
        let long_break_theme = ThemeBmc::get(ctx.clone(), &interface_cfg.long_break_theme_id)
            .await
            .unwrap();

        let app_state = AppState {
            timer,
            focus_theme,
            idle_theme,
            break_theme,
            long_break_theme,
        };

        app.manage(tokio::sync::Mutex::new(app_state));
    }
}

fn build_main_window(handle: &AppHandle) {
    tauri::WindowBuilder::new(handle, "main", tauri::WindowUrl::App("/".into()))
        .title("Intentio")
        .inner_size(300f64, 320f64)
        .max_inner_size(300f64, 320f64)
        .min_inner_size(300f64, 320f64)
        .fullscreen(false)
        .resizable(false)
        .decorations(false)
        .always_on_top(true)
        .center()
        .transparent(true)
        .build()
        .unwrap();
}
