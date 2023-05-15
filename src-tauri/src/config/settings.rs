use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

use crate::prelude::*;

use super::Config;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsConfig {
    pub alert_file: String,
    pub alert_volume: f32,
    #[ts(type = "number")]
    pub alert_repeat: i64,
    pub idle_theme_id: String,
    pub focus_theme_id: String,
    pub break_theme_id: String,
    pub long_break_theme_id: String,
    pub main_minimize_to_tray: bool,
    pub system_notifications: bool,
    pub main_always_on_top: bool,
}

impl Config for SettingsConfig {
    fn file_path(base_dir: &PathBuf) -> PathBuf {
        base_dir.join("settings.json")
    }
}

impl Default for SettingsConfig {
    fn default() -> Self {
        Self {
            alert_file: DEFAULT_ALERT_FILE.into(),
            alert_volume: 0.25,
            alert_repeat: 2,
            idle_theme_id: DEFAULT_IDLE_THEME_ID.to_string(),
            focus_theme_id: DEFAULT_FOCUS_THEME_ID.to_string(),
            break_theme_id: DEFAULT_BREAK_THEME_ID.to_string(),
            long_break_theme_id: DEFAULT_LONG_BREAK_THEME_ID.to_string(),
            main_minimize_to_tray: false,
            system_notifications: true,
            main_always_on_top: false,
        }
    }
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsConfigForUpdate {
    pub alert_audio: Option<String>,
    pub alert_volume: Option<f32>,
    #[ts(type = "number")]
    pub alert_repeat: Option<i64>,
    pub idle_theme_id: Option<String>,
    pub focus_theme_id: Option<String>,
    pub break_theme_id: Option<String>,
    pub long_break_theme_id: Option<String>,
    pub main_minimize_to_tray: Option<bool>,
    pub system_notifications: Option<bool>,
    pub main_always_on_top: Option<bool>,
}
