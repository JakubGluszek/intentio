#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::{DateTime, Utc};
use pomodoro::*;

#[tauri::command]
fn read_settings() -> Settings {
    Settings::read()
}

#[tauri::command]
fn update_settings(settings: Settings) -> Settings {
    Settings::update(settings)
}

#[tauri::command]
fn save_pomodoro(duration: u32, started_at: DateTime<Utc>) {
    let pomodoro = Pomodoro::new(duration, started_at);
    Pomodoro::save(pomodoro);
}

#[tauri::command]
fn read_pomodoros() -> Vec<Pomodoro> {
    Pomodoro::read()
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            Storage::setup();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            read_settings,
            update_settings,
            save_pomodoro,
            read_pomodoros
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
