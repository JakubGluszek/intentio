#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::{DateTime, Utc};
use pomodoro::*;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| {
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
        })
        .setup(|_app| {
            Storage::setup();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            read_settings,
            update_settings,
            save_pomodoro,
            read_pomodoros,
            save_project,
            read_projects,
            update_projects,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_settings() -> Settings {
    Settings::read()
}

#[tauri::command]
fn update_settings(settings: Settings) -> Settings {
    Settings::update(settings)
}

#[tauri::command]
fn save_pomodoro(duration: u32, started_at: DateTime<Utc>, project_id: Option<String>) {
    let pomodoro = Pomodoro::new(duration, started_at, project_id);
    Pomodoro::save(pomodoro);
}

#[tauri::command]
fn read_pomodoros() -> Vec<Pomodoro> {
    Pomodoro::read()
}

#[tauri::command]
fn save_project(title: String) -> Vec<Project> {
    let project = Project::new(title);
    Project::save(project)
}

#[tauri::command]
fn read_projects() -> Vec<Project> {
    Project::read()
}

#[tauri::command]
fn update_projects(projects: Vec<Project>) -> Vec<Project> {
    Project::update(projects)
}
