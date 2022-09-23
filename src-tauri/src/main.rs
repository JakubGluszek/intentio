#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use pomodoro::*;

#[tauri::command]
fn read_settings() -> Settings {
    Settings::read()
}

#[tauri::command]
fn update_settings(settings: Settings) -> Settings {
    Settings::update(settings)
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            Storage::setup();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![read_settings, update_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
