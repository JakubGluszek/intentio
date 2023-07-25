//! Utils IPC commands.
use std::fs::File;

use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    config::{ConfigManager, SettingsConfig},
    prelude::Result,
};

#[command]
pub async fn open_audio_dir(handle: AppHandle) {
    #[cfg(target_os = "linux")]
    let cmd = "xdg-open";

    #[cfg(target_os = "darwin")]
    let cmd = "open";

    #[cfg(target_os = "windows")]
    let cmd = "explorer";

    let path = handle
        .path_resolver()
        .resolve_resource("./audio")
        .expect("get audio directory");

    std::process::Command::new(cmd).arg(path).spawn().unwrap();
}

#[command]
pub async fn hide_main_window(app: AppHandle<Wry>) -> Result<()> {
    let app_handle = app.app_handle();
    let settings = ConfigManager::get::<SettingsConfig>()?;

    let window = app_handle.get_window("main").unwrap();

    if settings.main_minimize_to_tray {
        window.hide().unwrap();
    } else {
        window.minimize().unwrap();
    }

    Ok(())
}

#[command]
pub async fn exit_main_window() {
    std::process::exit(0);
}

#[command]
pub async fn play_audio(audio: Option<String>, app: AppHandle<Wry>) -> Result<()> {
    let app_handle = app.app_handle();
    let settings = ConfigManager::get::<SettingsConfig>()?;

    let audio = match audio {
        Some(path) => path,
        None => settings.alert_file,
    };

    let path = app_handle
        .path_resolver()
        .resolve_resource(format!("./audio/{}", &audio))
        .expect("failed to resolve resource");

    let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();

    for _i in 0..settings.alert_repeat {
        let file = File::open(path.as_path()).unwrap();
        let sink = stream_handle.play_once(file).unwrap();
        sink.set_volume(settings.alert_volume as f32);
        sink.sleep_until_end();
    }

    Ok(())
}

#[command]
pub async fn create_tiny_timer_window(app: AppHandle<Wry>) -> Result<()> {
    tauri::WindowBuilder::new(
        &app,
        "tiny-timer",
        tauri::WindowUrl::App("/tiny-timer".into()),
    )
    .title("Tiny Timer")
    .inner_size(240f64, 80f64)
    .max_inner_size(240f64, 80f64)
    .min_inner_size(240f64, 80f64)
    .fullscreen(false)
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .transparent(true)
    .visible(false)
    .build()?;

    Ok(())
}
