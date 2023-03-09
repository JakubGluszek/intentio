use std::{fs, path::Path, sync::Mutex};

use tauri::{App, AppHandle, Manager};
use tauri_hotkey::{Hotkey, HotkeyManager, Key, Modifier};

use crate::{
    cfg::{AudioCfg, BehaviorCfg, InterfaceCfg, TimerCfg},
    state::{State, TimerSession},
    utils,
};

pub fn init_setup(app: &mut App) {
    setup_config_dir();

    TimerCfg::setup();
    AudioCfg::setup();
    BehaviorCfg::setup();
    InterfaceCfg::setup();

    setup_state(app);

    setup_hotkeys_manager(app);
    build_main_window(&app.app_handle());
}

fn setup_state(app: &mut App) {
    let timer = TimerCfg::get();

    let session = TimerSession::new(timer.focus_duration * 60);

    let state = State::new(session);
    let state = Mutex::new(state);

    app.manage(state);
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
        .inner_size(320f64, 340f64)
        .max_inner_size(320f64, 340f64)
        .fullscreen(false)
        .resizable(false)
        .decorations(false)
        .always_on_top(true)
        .center()
        .transparent(true)
        .build()
        .unwrap();
}

fn setup_hotkeys_manager(app: &mut App) {
    let mut hm = HotkeyManager::new();
    let handle = app.app_handle();

    hm.register(
        Hotkey {
            modifiers: vec![Modifier::CTRL],
            keys: vec![Key::F1],
        },
        move || {
            let cmd_window = match handle.get_window("commands") {
                Some(window) => window,
                None => {
                    let window = tauri::WindowBuilder::new(
                        &handle,
                        "commands",
                        tauri::WindowUrl::App("/commands".into()),
                    )
                    .visible(true)
                    .center()
                    .skip_taskbar(true)
                    .focused(true)
                    .decorations(false)
                    .inner_size(480f64, 240f64)
                    .build()
                    .unwrap();

                    window
                }
            };

            cmd_window.show().unwrap();
        },
    )
    .expect("CTRL + F1 failed to register");

    app.manage(hm);
}
