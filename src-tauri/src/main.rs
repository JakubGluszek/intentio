#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod ctx;
mod database;
mod db;
mod error;
mod ipc;
mod models;
mod prelude;
mod schema;
mod setup;
mod state;
mod utils;

use std::sync::Mutex;

use crate::ipc::*;
use crate::prelude::*;
use db::Db;
use setup::setup_database;
use setup::setup_hook;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_autostart::MacosLauncher;
use tokio::runtime::Builder;

fn main() -> Result<()> {
    let runtime = Builder::new_current_thread()
        .enable_time()
        .build()
        .expect("expected tokio runtime");

    let database = runtime
        .block_on(setup_database())
        .expect("database should be set up");

    let conn = Db::setup().expect("the database should be set up");

    tauri::Builder::default()
        .manage(Mutex::new(conn))
        .manage(database)
        .system_tray(SystemTray::new().with_menu(create_tray_menu()))
        .on_system_tray_event(handle_on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            // state
            get_current_theme,
            set_current_theme,
            update_timer_state,
            set_idle_theme,
            set_focus_theme,
            set_break_theme,
            set_long_break_theme,
            // config
            get_timer_config,
            update_timer_config,
            get_settings_config,
            update_settings_config,
            // Utils
            open_audio_dir,
            play_audio,
            hide_main_window,
            exit_main_window,
            // Theme
            get_theme,
            get_themes,
            create_theme,
            update_theme,
            delete_theme,
            delete_themes,
            // Intent
            get_intent,
            get_intents,
            create_intent,
            update_intent,
            delete_intent,
            archive_intent,
            unarchive_intent,
            // Task
            create_task,
            update_task,
            delete_task,
            delete_tasks,
            get_tasks,
            get_tasks_by_intent_id,
            // Session
            create_session,
            get_session,
            get_sessions,
            // Script
            get_scripts,
            create_script,
            update_script,
            delete_script
        ])
        .setup(move |app| Ok(runtime.block_on(setup_hook(app))))
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}

fn create_tray_menu() -> SystemTrayMenu {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    SystemTrayMenu::new()
        .add_item(open)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit)
}

fn handle_on_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "open" => {
                // handle error, can crash if window was closed
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        },
        SystemTrayEvent::LeftClick { .. } => {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
        }
        _ => {}
    }
}
