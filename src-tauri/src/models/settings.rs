//! All models and controller for the Settings type

use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, prelude::*};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Settings {
    #[ts(type = "number")]
    pub pomodoro_duration: Minutes,

    #[ts(type = "number")]
    pub break_duration: Minutes,

    #[ts(type = "number")]
    pub long_break_duration: Minutes,

    #[ts(type = "number")]
    pub long_break_interval: i64,

    pub auto_start_pomodoros: bool,
    pub auto_start_breaks: bool,

    pub alert_audio: String,
    pub alert_volume: f32,
    pub system_notifications: bool,

    #[ts(type = "number")]
    pub alert_repeat: i64,

    pub current_theme_id: String,

    pub display_live_countdown: bool,
    pub main_window_to_tray: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            pomodoro_duration: 25,
            break_duration: 5,
            long_break_duration: 10,
            long_break_interval: 4,
            auto_start_pomodoros: false,
            auto_start_breaks: false,
            alert_audio: DEFAULT_ALERT_FILE.into(),
            alert_volume: 0.25,
            alert_repeat: 2,
            system_notifications: true,
            current_theme_id: DEFAULT_THEME.into(),
            display_live_countdown: true,
            main_window_to_tray: true,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsForUpdate {
    #[ts(type = "number")]
    pub pomodoro_duration: Option<i64>,

    #[ts(type = "number")]
    pub break_duration: Option<i64>,

    #[ts(type = "number")]
    pub long_break_duration: Option<i64>,

    #[ts(type = "number")]
    pub long_break_interval: Option<i64>,

    pub auto_start_pomodoros: Option<bool>,
    pub auto_start_breaks: Option<bool>,

    pub alert_audio: Option<String>,
    pub alert_volume: Option<f32>,
    pub system_notifications: Option<bool>,

    #[ts(type = "number")]
    pub alert_repeat: Option<i64>,

    pub current_theme_id: Option<String>,

    pub display_live_countdown: Option<bool>,
    pub main_window_to_tray: Option<bool>,
}

pub struct SettingsBmc;

impl SettingsBmc {
    /// Writes default settings to "/intentio/settings.toml" if the file doesn't yet exist.
    pub fn init() -> Result<()> {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let settings = Settings::default();
            Self::save(&settings)?;
        }

        Ok(())
    }

    pub fn save(settings: &Settings) -> Result<()> {
        let path = Self::get_path();
        let toml = toml::to_string(settings).unwrap();

        fs::write(&path, toml)?;

        Ok(())
    }

    pub fn get() -> Result<Settings> {
        let path = Self::get_path();

        let contents = fs::read_to_string(path)?;

        let settings: Settings = match toml::from_str(&contents) {
            Ok(settings) => settings,
            Err(_) => {
                let settings = Settings::default();
                Self::save(&settings)?;

                settings
            }
        };

        Ok(settings)
    }

    pub fn update(ctx: Arc<Ctx>, data: SettingsForUpdate) -> Result<Settings> {
        let mut settings = Self::get()?;
        let mut events: Vec<&str> = vec![];

        if let Some(pomodoro_duration) = data.pomodoro_duration {
            settings.pomodoro_duration = pomodoro_duration;
        }
        if let Some(break_duration) = data.break_duration {
            settings.break_duration = break_duration;
        }
        if let Some(long_break_duration) = data.long_break_duration {
            settings.long_break_duration = long_break_duration;
        }
        if let Some(long_break_interval) = data.long_break_interval {
            settings.long_break_interval = long_break_interval;
        }
        if let Some(auto_start_pomodoros) = data.auto_start_pomodoros {
            settings.auto_start_pomodoros = auto_start_pomodoros;
        }
        if let Some(auto_start_breaks) = data.auto_start_breaks {
            settings.auto_start_breaks = auto_start_breaks;
        }
        if let Some(alert_audio) = data.alert_audio {
            settings.alert_audio = alert_audio;
        }
        if let Some(alert_volume) = data.alert_volume {
            settings.alert_volume = alert_volume;
        }
        if let Some(alert_repeat) = data.alert_repeat {
            settings.alert_repeat = alert_repeat;
        }
        if let Some(system_notifications) = data.system_notifications {
            settings.system_notifications = system_notifications;
        }
        if let Some(current_theme_id) = data.current_theme_id {
            settings.current_theme_id = current_theme_id;
            events.push("current_theme_changed");
        }
        if let Some(display_live_countdown) = data.display_live_countdown {
            settings.display_live_countdown = display_live_countdown;
        }
        if let Some(main_window_to_tray) = data.main_window_to_tray {
            settings.main_window_to_tray = main_window_to_tray;
        }

        let path = Self::get_path();
        let toml = toml::to_string(&settings).unwrap();

        fs::write(&path, toml)?;

        ctx.emit_event("settings_updated", settings.clone());

        for e in events {
            ctx.emit_event(e, "");
        }

        Ok(settings)
    }

    fn get_path() -> String {
        let path = tauri::api::path::config_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned();

        let path = path + "/intentio/settings.toml";

        path
    }
}

#[cfg(test)]
mod tests {}
