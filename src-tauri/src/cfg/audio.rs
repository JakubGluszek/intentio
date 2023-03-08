use std::{fs, sync::Arc};

use crate::{ctx::Ctx, prelude::*, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Audio {
    pub alert_file: String,
    pub alert_volume: f32,

    #[ts(type = "number")]
    pub alert_repeat: i64,
}

impl Default for Audio {
    fn default() -> Self {
        Self {
            alert_file: DEFAULT_ALERT_FILE.into(),
            alert_volume: 0.25,
            alert_repeat: 2,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct AudioForUpdate {
    pub alert_audio: Option<String>,
    pub alert_volume: Option<f32>,

    #[ts(type = "number")]
    pub alert_repeat: Option<i64>,
}

pub struct AudioCfg;

impl AudioCfg {
    pub fn get() -> Audio {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(audio) => audio,
            Err(_) => {
                let audio = Audio::default();

                Self::save(&audio);

                audio
            }
        }
    }

    pub fn save(config: &Audio) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: AudioForUpdate) {
        let mut audio = Self::get();

        if let Some(alert_audio) = data.alert_audio {
            audio.alert_file = alert_audio;
        }
        if let Some(alert_volume) = data.alert_volume {
            audio.alert_volume = alert_volume;
        }
        if let Some(alert_repeat) = data.alert_repeat {
            audio.alert_repeat = alert_repeat;
        }

        Self::save(&audio);

        // emit update event
    }

    fn get_path() -> String {
        utils::get_config_path() + "/audio.json"
    }
}

#[cfg(test)]
mod tests {}
