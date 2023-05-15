use tauri::{command, AppHandle, Wry};

use crate::{
    config::{
        ConfigManager, SettingsConfig, SettingsConfigForUpdate, TimerConfig, TimerConfigForUpdate,
    },
    ctx::Ctx,
    prelude::Result,
};

#[command]
pub async fn get_timer_config() -> Result<TimerConfig> {
    ConfigManager::get::<TimerConfig>()
}

#[command]
pub async fn update_timer_config(app: AppHandle<Wry>, data: TimerConfigForUpdate) -> Result<()> {
    let ctx = Ctx::from_app(app)?;
    let config = ConfigManager::update::<TimerConfig, TimerConfigForUpdate>(data)?;
    ctx.emit_event("timer_config_updated", config);
    Ok(())
}

#[command]
pub async fn get_settings_config() -> Result<SettingsConfig> {
    ConfigManager::get::<SettingsConfig>()
}

#[command]
pub async fn update_settings_config(
    app: AppHandle<Wry>,
    data: SettingsConfigForUpdate,
) -> Result<()> {
    let ctx = Ctx::from_app(app)?;
    let config = ConfigManager::update::<SettingsConfig, SettingsConfigForUpdate>(data)?;
    ctx.emit_event("settings_config_updated", config);
    Ok(())
}
