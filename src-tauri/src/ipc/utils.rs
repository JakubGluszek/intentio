//! Utils IPC commands.

use std::fs::File;

use tauri::{command, AppHandle};

use crate::model::SettingsBmc;

#[command]
pub async fn open_audio_directory(os_type: String, handle: AppHandle) {
    let cmd = match os_type.as_str() {
        "Linux" => "xdg-open",
        "Darwin" => "open",
        "Windows_NT" => "explorer",
        _ => "xdp-open",
    };

    let path = handle
        .path_resolver()
        .resolve_resource("./assets/audio")
        .expect("get audio directory");

    std::process::Command::new(cmd).arg(path).spawn().unwrap();
}

#[command]
pub async fn play_audio(audio: Option<String>, handle: AppHandle) {
    let mut settings = SettingsBmc::get().unwrap();

    let audio = match audio {
        Some(path) => path,
        None => settings.alert_audio,
    };

    let path = handle
        .path_resolver()
        .resolve_resource(format!("./assets/audio/{}", &audio))
        .expect("failed to resolve resource");

    let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();

    for _i in 0..settings.alert_repeat {
        settings = SettingsBmc::get().unwrap();

        let file = File::open(path.as_path()).unwrap();
        let sink = stream_handle.play_once(file).unwrap();
        sink.set_volume(settings.alert_volume as f32);
        sink.sleep_until_end();
    }
}
