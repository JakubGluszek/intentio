#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cfg;
mod ctx;
mod database;
mod error;
mod ipc;
mod models;
mod prelude;
mod setup;
mod utils;

use crate::ipc::*;
use crate::prelude::*;
use database::Database;
use models::ThemeBmc;
use setup::init_setup;
use std::sync::Arc;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[tokio::main]
async fn main() -> Result<()> {
    let database = Database::new().await?;
    let database = Arc::new(database);

    ThemeBmc::init_default_themes(database.clone()).await?;

    tauri::Builder::default()
        .manage(database)
        .system_tray(SystemTray::new().with_menu(create_tray_menu()))
        .on_system_tray_event(handle_on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            // config
            get_timer_config,
            update_timer_config,
            get_audio_config,
            update_audio_config,
            get_behavior_config,
            update_behavior_config,
            get_interface_config,
            update_interface_config,
            // Utils
            open_audio_dir,
            play_audio,
            get_current_theme,
            set_current_theme,
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
            get_intents,
            create_intent,
            update_intent,
            delete_intent,
            archive_intent,
            unarchive_intent,
            // Note
            get_notes,
            create_note,
            update_note,
            delete_note,
            delete_notes,
            // Task
            create_task,
            update_task,
            delete_task,
            delete_tasks,
            get_tasks,
            // Session
            get_sessions,
            create_session,
            // Script
            get_scripts,
            create_script,
            update_script,
            delete_script
        ])
        .setup(|app| {
            init_setup(app);
            Ok(())
        })
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
        #[cfg(target_os = "windows")]
        SystemTrayEvent::LeftClick { .. } => {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
        }
        _ => {}
    }
}
