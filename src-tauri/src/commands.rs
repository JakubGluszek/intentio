//! Arbitrary IPC commands.

use tauri::command;

#[command]
pub async fn open_folder(os_type: String, path: String) {
    let cmd = match os_type.as_str() {
        "Linux" => "xdg-open",
        "Darwin" => "open",
        "Windows_NT" => "explorer",
        _ => "xdp-open",
    };

    std::process::Command::new(cmd).arg(path).spawn().unwrap();
}

/*
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
*/
