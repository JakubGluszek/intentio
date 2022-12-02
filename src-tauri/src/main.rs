#![cfg_attr(
    all(not(debug_assertions), target_os = "linux"),
    windows_subsystem = "windows"
)]

mod ctx;
mod error;
mod ipc;
mod model;
mod prelude;
mod startup;
mod state;
mod store;
mod utils;

use crate::ipc::*;
use crate::prelude::*;
use startup::init;
use state::State;
use std::sync::Arc;
use store::Store;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[tokio::main]
async fn main() -> Result<()> {
    let store = Store::new().await?;
    let store = Arc::new(store);

    init(store.clone()).await?;

    tauri::Builder::default()
        .manage(tokio::sync::Mutex::new(State::default()))
        .manage(store)
        .system_tray(SystemTray::new().with_menu(create_tray_menu()))
        .on_system_tray_event(handle_on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            // State
            get_session_queue,
            set_session_queue,
            get_current_project,
            set_current_project,
            // Helpers
            get_current_theme,
            get_current_project,
            // Utils
            open_audio_directory,
            play_audio,
            // Settings
            get_settings,
            update_settings,
            // Theme
            get_theme,
            get_themes,
            create_theme,
            update_theme,
            delete_theme,
            // Project
            get_project,
            get_projects,
            create_project,
            delete_project,
            // Session
            get_sessions,
            create_session,
            // Queue
            get_queue,
            get_queues,
            create_queue,
            update_queue,
            delete_queue,
        ])
        .plugin(tauri_plugin_window_state::Builder::default().build())
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
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "open" => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        }
    }
}
