use std::{fs, path::Path};

use tauri::{App, AppHandle, Manager};
use tauri_hotkey::{Hotkey, HotkeyManager, Key, Modifier};

use crate::{
    cfg::{AudioCfg, BehaviorCfg, InterfaceCfg, TimerCfg},
    utils,
};

pub fn init_setup(app: &mut App) {
    setup_config_dir();

    TimerCfg::setup();
    AudioCfg::setup();
    BehaviorCfg::setup();
    InterfaceCfg::setup();

    build_main_window(&app.app_handle());
}

fn setup_config_dir() {
    let path = utils::get_config_path();

    if !Path::new(&path).is_dir() {
        fs::create_dir(path).unwrap();
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
