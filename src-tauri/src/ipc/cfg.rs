use tauri::{command, AppHandle, Wry};

use crate::{
    cfg::{
        AudioCfg, AudioConfig, AudioConfigForUpdate, BehaviorCfg, BehaviorConfig,
        BehaviorConfigForUpdate, InterfaceCfg, InterfaceConfig, InterfaceConfigForUpdate, TimerCfg,
        TimerConfig,
    },
    config::{self, ConfigManager},
    ctx::Ctx,
    prelude::{Error, Result},
};

// #[command]
// pub async fn get_timer_config(app: AppHandle<Wry>) -> Result<TimerConfig> {
//     match Ctx::from_app(app) {
//         Ok(_) => Ok(TimerCfg::get()),
//         Err(_) => Err(Error::CtxFail).into(),
//     }
// }
//
// #[command]
// pub async fn update_timer_config(
//     app: AppHandle<Wry>,
//     data: config::TimerConfigForUpdate,
// ) -> Result<config::TimerConfig> {
//     match Ctx::from_app(app) {
//         Ok(ctx) => ctx.update_config::<config::TimerConfig, config::TimerConfigForUpdate>(data),
//         Err(_) => Err(Error::CtxFail).into(),
//     }
// }

#[command]
pub async fn get_audio_config(app: AppHandle<Wry>) -> Result<AudioConfig> {
    match Ctx::from_app(app) {
        Ok(_) => Ok(AudioCfg::get()),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_audio_config(
    app: AppHandle<Wry>,
    data: AudioConfigForUpdate,
) -> Result<AudioConfig> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let audio_cfg = AudioCfg::update(ctx, data);
            Ok(audio_cfg)
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_behavior_config(app: AppHandle<Wry>) -> Result<BehaviorConfig> {
    match Ctx::from_app(app) {
        Ok(_) => Ok(BehaviorCfg::get()),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_behavior_config(
    app: AppHandle<Wry>,
    data: BehaviorConfigForUpdate,
) -> Result<BehaviorConfig> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let behavior_cfg = BehaviorCfg::update(ctx, data);
            Ok(behavior_cfg)
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_interface_config(app: AppHandle<Wry>) -> Result<InterfaceConfig> {
    match Ctx::from_app(app) {
        Ok(_) => Ok(InterfaceCfg::get()),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_interface_config(
    app: AppHandle<Wry>,
    data: InterfaceConfigForUpdate,
) -> Result<InterfaceConfig> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let interface_cfg = InterfaceCfg::update(ctx, data);
            Ok(interface_cfg)
        }
        Err(_) => Err(Error::CtxFail).into(),
    }
}
