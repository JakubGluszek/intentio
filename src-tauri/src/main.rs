#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod bmc;
mod config;
mod ctx;
mod db;
mod error;
mod ipc;
mod models;
mod prelude;
mod setup;
mod state;
mod timer;

use crate::ipc::*;
use crate::prelude::*;
use setup::setup_hook;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use tauri_plugin_autostart::MacosLauncher;

fn main() -> Result<()> {
    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(create_tray_menu()))
        .on_system_tray_event(handle_on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            // State
            get_current_theme,
            set_current_theme,
            update_timer_state,
            set_idle_theme,
            set_focus_theme,
            set_break_theme,
            set_long_break_theme,
            // Config
            get_timer_config,
            update_timer_config,
            get_settings_config,
            update_settings_config,
            get_queue_config,
            update_queue_config,
            // Utils
            open_audio_dir,
            play_audio,
            hide_main_window,
            exit_main_window,
            create_tiny_timer_window,
            // Theme
            create_theme,
            update_theme,
            delete_theme,
            get_theme,
            get_themes,
            // Intent
            get_intent,
            get_intents,
            create_intent,
            update_intent,
            delete_intent,
            archive_intent,
            unarchive_intent,
            add_intent_tag,
            delete_intent_tag,
            // Task
            create_task,
            update_task,
            delete_task,
            get_task,
            get_tasks,
            complete_task,
            uncomplete_task,
            // Session
            update_session,
            get_session,
            get_sessions,
            // Script
            create_script,
            update_script,
            delete_script,
            get_script,
            get_scripts,
            // Timer
            timer_get_session,
            timer_set_session_intent,
            timer_play,
            timer_stop,
            timer_restart,
            timer_skip,
            timer_get_queue,
            timer_add_to_queue,
            timer_remove_from_queue,
            timer_reorder_queue,
            timer_clear_queue,
            timer_increment_queue_session_iterations,
            timer_decrement_queue_session_iterations,
            timer_update_queue_session_duration,
            // Intent Tags
            create_tag,
            update_tag,
            delete_tag,
            get_tag,
            get_tags,
            get_intent_tags,
        ])
        .setup(move |app| Ok(setup_hook(app)))
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_positioner::init())
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
