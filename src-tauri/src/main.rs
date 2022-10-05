#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rodio::Source;
use std::fs::File;
use std::io::BufReader;
use std::thread;
use std::time::Duration;

use chrono::{DateTime, Utc};
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

use pomodoro::*;

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
            settings_read,
            settings_update,
            pomodoro_save,
            pomodoros_read,
            project_save,
            projects_read,
            projects_save,
            theme_save,
            themes_read,
            themes_save,
            open_folder,
            play_audio,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn play_audio(path: Option<String>) {
    let settings = Settings::read();
    let path = match path {
        Some(path) => path,
        None => settings.alert.path,
    };

    let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();

    for _i in 0..settings.alert.repeat {
        let file = File::open(path.clone()).unwrap();
        let sink = stream_handle.play_once(file).unwrap();
        sink.set_volume(settings.alert.volume);
        sink.sleep_until_end();
    }
}

#[tauri::command]
fn open_folder(os_type: String, path: String) {
    let command = match os_type.as_str() {
        "Linux" => "xdg-open",
        "Darwin" => "open",
        "Windows_NT" => "explorer",
        _ => "xdp-open",
    };

    std::process::Command::new(command)
        .arg(path)
        .spawn()
        .unwrap();
}

#[tauri::command]
fn settings_read() -> Settings {
    Settings::read()
}

#[tauri::command]
fn settings_update(settings: Settings) -> Settings {
    Settings::update(settings)
}

#[tauri::command]
fn pomodoro_save(duration: u32, started_at: DateTime<Utc>, project_id: Option<String>) {
    let pomodoro = Pomodoro::new(duration, started_at, project_id);
    Pomodoro::save(pomodoro);
}

#[tauri::command]
fn pomodoros_read() -> Vec<Pomodoro> {
    Pomodoro::read()
}

#[tauri::command]
fn project_save(title: String) -> Vec<Project> {
    let project = Project::new(title);
    Project::save(project)
}

#[tauri::command]
fn projects_read() -> Vec<Project> {
    Project::read()
}

#[tauri::command]
fn projects_save(projects: Vec<Project>) -> Vec<Project> {
    Project::update(projects)
}

#[tauri::command]
fn theme_save(name: String, colors: Colors) -> Vec<Theme> {
    let theme = Theme::new(name, colors);
    Theme::save(theme)
}

#[tauri::command]
fn themes_read() -> Vec<Theme> {
    Theme::read()
}

#[tauri::command]
fn themes_save(themes: Vec<Theme>) -> Vec<Theme> {
    Theme::update(themes)
}
