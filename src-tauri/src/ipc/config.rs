use tauri::{command, AppHandle, Manager};

use crate::{
    config::{
        ConfigManager, SettingsConfig, SettingsConfigForUpdate, TimerConfig, TimerConfigForUpdate,
    },
    prelude::Result,
};

use super::EventPayload;

#[command]
pub async fn get_timer_config() -> Result<TimerConfig> {
    ConfigManager::get::<TimerConfig>()
}

#[command]
pub async fn update_timer_config(app_handle: AppHandle, data: TimerConfigForUpdate) -> Result<()> {
    let config = ConfigManager::update::<TimerConfig, TimerConfigForUpdate>(data)?;
    let payload = EventPayload { data: config };
    app_handle.emit_all("timer_config_updated", payload)?;
    Ok(())
}

#[command]
pub async fn get_settings_config() -> Result<SettingsConfig> {
    ConfigManager::get::<SettingsConfig>()
}

#[command]
pub async fn update_settings_config(
    app_handle: AppHandle,
    data: SettingsConfigForUpdate,
) -> Result<()> {
    let config = ConfigManager::update::<SettingsConfig, SettingsConfigForUpdate>(data)?;
    let payload = EventPayload { data: config };
    app_handle.emit_all("settings_config_updated", payload)?;
    Ok(())
}
