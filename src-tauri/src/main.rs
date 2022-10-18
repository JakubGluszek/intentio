#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod ctx;
mod error;
mod event;
mod ipc;
mod model;
mod prelude;
mod store;
mod utils;

use crate::commands::*;
use crate::ipc::*;
use crate::prelude::*;
use model::SettingsBmc;
use std::sync::Arc;
use store::Store;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[tokio::main]
async fn main() -> Result<()> {
    let store = Store::new().await?;
    let store = Arc::new(store);

    init_db(store.clone()).await?;

    tauri::Builder::default()
        .manage(store)
        .system_tray(SystemTray::new().with_menu(create_tray_menu()))
        .on_system_tray_event(handle_on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            open_folder,
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
            update_project,
            delete_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

async fn init_db(store: Arc<Store>) -> Result<()> {
    SettingsBmc::init(store).await?;
    Ok(())
}

fn create_tray_menu() -> SystemTrayMenu {
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit)
}

fn handle_on_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        }
    }
}
