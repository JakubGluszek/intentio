use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, prelude::*, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerConfig {
    #[ts(type = "number")]
    pub focus_duration: Minutes,

    #[ts(type = "number")]
    pub break_duration: Minutes,

    #[ts(type = "number")]
    pub long_break_duration: Minutes,

    #[ts(type = "number")]
    pub long_break_interval: i64,

    pub auto_start_focus: bool,
    pub auto_start_breaks: bool,
}

impl Default for TimerConfig {
    fn default() -> Self {
        Self {
            focus_duration: 25,
            break_duration: 5,
            long_break_duration: 10,
            long_break_interval: 4,
            auto_start_focus: false,
            auto_start_breaks: false,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerConfigForUpdate {
    #[ts(type = "number")]
    pub focus_duration: Option<i64>,

    #[ts(type = "number")]
    pub break_duration: Option<i64>,

    #[ts(type = "number")]
    pub long_break_duration: Option<i64>,

    #[ts(type = "number")]
    pub long_break_interval: Option<i64>,

    pub auto_start_focus: Option<bool>,
    pub auto_start_breaks: Option<bool>,
}

pub struct TimerCfg;

impl TimerCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let config = TimerConfig::default();
            Self::save(&config);
        }
    }

    pub fn get() -> TimerConfig {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(config) => config,
            Err(_) => {
                let config = TimerConfig::default();

                Self::save(&config);

                config
            }
        }
    }

    pub fn save(config: &TimerConfig) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: TimerConfigForUpdate) -> TimerConfig {
        let mut config = Self::get();

        if let Some(focus_duration) = data.focus_duration {
            config.focus_duration = focus_duration;
        }
        if let Some(break_duration) = data.break_duration {
            config.break_duration = break_duration;
        }
        if let Some(long_break_duration) = data.long_break_duration {
            config.long_break_duration = long_break_duration;
        }
        if let Some(long_break_interval) = data.long_break_interval {
            config.long_break_interval = long_break_interval;
        }
        if let Some(auto_start_focus) = data.auto_start_focus {
            config.auto_start_focus = auto_start_focus;
        }
        if let Some(auto_start_breaks) = data.auto_start_breaks {
            config.auto_start_breaks = auto_start_breaks;
        }

        Self::save(&config);

        ctx.emit_event("timer_cfg_updated", config.clone());

        config
    }

    fn get_path() -> String {
        utils::get_config_path() + "/timer.json"
    }
}

#[cfg(test)]
mod tests {}
