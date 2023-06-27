use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

use crate::timer::QueueSession;

use super::Config;

type QueueTemplate = Vec<QueueSession>;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueConfig {
    templates: Vec<QueueTemplate>,
}

impl Config for QueueConfig {
    fn file_path(base_dir: &PathBuf) -> PathBuf {
        base_dir.join("queue.json")
    }
}

impl Default for QueueConfig {
    fn default() -> Self {
        Self { templates: vec![] }
    }
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueConfigForUpdate {
    templates: Option<Vec<QueueTemplate>>,
}
