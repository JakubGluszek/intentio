use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

use crate::prelude::Minutes;

use super::Config;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
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
    pub session_summary: bool,
}

impl Config for TimerConfig {
    fn file_path(base_dir: &PathBuf) -> PathBuf {
        base_dir.join("timer.json")
    }
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
            session_summary: true,
        }
    }
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, TS, Debug)]
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
    pub session_summary: Option<bool>,
}
