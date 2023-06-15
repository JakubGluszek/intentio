use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

use crate::prelude::*;

use super::Config;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsConfig {
    pub idle_theme_id: i32,
    pub focus_theme_id: i32,
    pub break_theme_id: i32,
    pub long_break_theme_id: i32,
    pub alert_file: String,
    pub alert_volume: f32,
    #[ts(type = "number")]
    pub alert_repeat: i64,
    pub system_notifications: bool,
    pub main_minimize_to_tray: bool,
    pub main_always_on_top: bool,
    pub main_display_on_timer_complete: bool,
}

impl Config for SettingsConfig {
    fn file_path(base_dir: &PathBuf) -> PathBuf {
        base_dir.join("settings.json")
    }
}

impl Default for SettingsConfig {
    fn default() -> Self {
        Self {
            idle_theme_id: 1,
            focus_theme_id: 2,
            break_theme_id: 3,
            long_break_theme_id: 4,
            alert_file: DEFAULT_ALERT_FILE.into(),
            alert_volume: 0.25,
            alert_repeat: 2,
            system_notifications: true,
            main_minimize_to_tray: false,
            main_always_on_top: false,
            main_display_on_timer_complete: true,
        }
    }
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsConfigForUpdate {
    pub idle_theme_id: Option<i32>,
    pub focus_theme_id: Option<i32>,
    pub break_theme_id: Option<i32>,
    pub long_break_theme_id: Option<i32>,
    pub alert_file: Option<String>,
    pub alert_volume: Option<f32>,
    #[ts(type = "number")]
    pub alert_repeat: Option<i64>,
    pub system_notifications: Option<bool>,
    pub main_minimize_to_tray: Option<bool>,
    pub main_always_on_top: Option<bool>,
    pub main_display_on_timer_complete: Option<bool>,
}
