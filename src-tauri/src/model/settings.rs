//! All models and controller for the Settings type
//! TODO:Store settings data in .TOML file.

use std::{
    fs,
    path::{Path, PathBuf},
    sync::Arc,
};

use crate::{ctx::Ctx, prelude::*};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use tauri::Manager;
use ts_rs::TS;

use super::{fire_model_event, Minutes};

#[derive(Serialize, Deserialize, TS, Debug, PartialEq)]
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
    pub alert_path: PathBuf,
    pub alert_volume: f64,

    #[ts(type = "number")]
    pub alert_repeat: i64,

    pub current_theme_id: String,
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
            alert_path: "".into(),
            alert_volume: 0.50,
            alert_repeat: 2,
            current_theme_id: "theme:abyss".into(),
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
    pub alert_path: Option<PathBuf>,
    pub alert_volume: Option<f64>,

    #[ts(type = "number")]
    pub alert_repeat: Option<i64>,

    pub current_theme_id: Option<String>,
}

pub struct SettingsBmc;

impl SettingsBmc {
    const ENTITY: &'static str = "settings";

    /// Writes default settings to "/pomodoro/settings.toml" if the file doesn't yet exist.
    pub fn initialize() -> Result<()> {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let toml = toml::to_string(&Settings::default()).unwrap();
            fs::write(&path, toml)?;
        }

        Ok(())
    }

    pub fn get() -> Result<Settings> {
        let path = Self::get_path();

        let contents = fs::read_to_string(path)?;

        let settings: Settings = toml::from_str(&contents).unwrap();

        Ok(settings)
    }

    pub fn update(data: SettingsForUpdate) -> Result<Settings> {
        let mut settings = Self::get()?;

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
        if let Some(alert_path) = data.alert_path {
            settings.alert_path = alert_path;
        }
        if let Some(alert_volume) = data.alert_volume {
            settings.alert_volume = alert_volume;
        }
        if let Some(alert_repeat) = data.alert_repeat {
            settings.alert_repeat = alert_repeat;
        }
        if let Some(current_theme_id) = data.current_theme_id {
            settings.current_theme_id = current_theme_id;
        }

        let path = Self::get_path();
        let toml = toml::to_string(&settings).unwrap();

        fs::write(&path, toml)?;

        Ok(settings)
    }

    fn get_path() -> String {
        let path = tauri::api::path::config_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned();

        let path = path + "/pomodoro/settings.toml";

        path
    }
}

#[cfg(test)]
mod tests {}
