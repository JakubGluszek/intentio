#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
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
use tauri_hotkey::Hotkey;
use tauri_hotkey::HotkeyManager;
use tauri_hotkey::Key;
use tauri_hotkey::Modifier;

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
            get_active_intent_id,
            set_active_intent_id,
            // Utils
            open_audio_dir,
            play_audio,
            get_current_theme,
            set_current_theme,
            hide_main_window,
            exit_main_window,
            // Settings
            get_settings,
            update_settings,
            // Theme
            get_theme,
            get_themes,
            create_theme,
            update_theme,
            delete_theme,
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
            let mut hm = HotkeyManager::new();
            let handle = app.app_handle();

            // build main window
            tauri::WindowBuilder::new(&handle, "main", tauri::WindowUrl::App("/".into()))
                .title("Intentio")
                .inner_size(340f64, 360f64)
                .max_inner_size(340f64, 360f64)
                .fullscreen(false)
                .resizable(true)
                .decorations(false)
                .always_on_top(true)
                .center()
                .transparent(true)
                .build()
                .unwrap();

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
