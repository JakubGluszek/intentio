use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, prelude::*, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Timer {
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
}

impl Default for Timer {
    fn default() -> Self {
        Self {
            pomodoro_duration: 25,
            break_duration: 5,
            long_break_duration: 10,
            long_break_interval: 4,
            auto_start_pomodoros: false,
            auto_start_breaks: false,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerForUpdate {
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
}

pub struct TimerCfg;

impl TimerCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let timer = Timer::default();
            Self::save(&timer);
        }
    }

    pub fn get() -> Timer {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(timer) => timer,
            Err(_) => {
                let timer = Timer::default();

                Self::save(&timer);

                timer
            }
        }
    }

    pub fn save(config: &Timer) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: TimerForUpdate) {
        let mut timer = Self::get();

        if let Some(pomodoro_duration) = data.pomodoro_duration {
            timer.pomodoro_duration = pomodoro_duration;
        }
        if let Some(break_duration) = data.break_duration {
            timer.break_duration = break_duration;
        }
        if let Some(long_break_duration) = data.long_break_duration {
            timer.long_break_duration = long_break_duration;
        }
        if let Some(long_break_interval) = data.long_break_interval {
            timer.long_break_interval = long_break_interval;
        }
        if let Some(auto_start_pomodoros) = data.auto_start_pomodoros {
            timer.auto_start_pomodoros = auto_start_pomodoros;
        }
        if let Some(auto_start_breaks) = data.auto_start_breaks {
            timer.auto_start_breaks = auto_start_breaks;
        }

        Self::save(&timer);

        // emit update event
    }

    fn get_path() -> String {
        utils::get_config_path() + "/timer.json"
    }
}

#[cfg(test)]
mod tests {}
