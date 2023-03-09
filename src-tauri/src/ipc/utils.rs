//! Utils IPC commands.

use std::fs::File;

use tauri::{command, AppHandle, Manager, Wry};

use crate::{
    cfg::{AudioCfg, BehaviorCfg, InterfaceCfg, InterfaceConfigForUpdate},
    ctx::Ctx,
    models::{Theme, ThemeBmc},
    prelude::{Error, Result},
};

#[command]
pub async fn get_current_theme(app: AppHandle<Wry>) -> Result<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let config = InterfaceCfg::get();
            ThemeBmc::get(ctx, &config.theme_id).await.into()
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn set_current_theme(
    data: InterfaceConfigForUpdate,
    app: AppHandle<Wry>,
) -> Result<Theme> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            InterfaceCfg::update(ctx.clone(), data);

            let config = InterfaceCfg::get();

            ThemeBmc::get(ctx, &config.theme_id).await.into()
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn open_audio_dir(handle: AppHandle) {
    let mut cmd = "xdg-open";
    #[cfg(target_os = "linux")]
    {
        cmd = "xdg-open";
    }
    #[cfg(target_os = "darwin")]
    {
        cmd = "open";
    }
    #[cfg(target_os = "windows")]
    {
        cmd = "explorer";
    }

    let path = handle
        .path_resolver()
        .resolve_resource("./audio")
        .expect("get audio directory");

    std::process::Command::new(cmd).arg(path).spawn().unwrap();
}

#[command]
pub async fn hide_main_window(app: AppHandle) {
    let config = BehaviorCfg::get();

    let window = app.get_window("main").unwrap();

    if config.main_minimize_to_tray {
        window.hide().unwrap();
    } else {
        window.minimize().unwrap();
    }
}

#[command]
pub async fn exit_main_window() {
    std::process::exit(0);
}

#[command]
pub async fn play_audio(audio: Option<String>, handle: AppHandle) {
    let mut config = AudioCfg::get();

    let audio = match audio {
        Some(path) => path,
        None => config.alert_file,
    };

    let path = handle
        .path_resolver()
        .resolve_resource(format!("./audio/{}", &audio))
        .expect("failed to resolve resource");

    let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();

    for _i in 0..config.alert_repeat {
        config = AudioCfg::get();

        let file = File::open(path.as_path()).unwrap();
        let sink = stream_handle.play_once(file).unwrap();
        sink.set_volume(config.alert_volume as f32);
        sink.sleep_until_end();
    }
}
