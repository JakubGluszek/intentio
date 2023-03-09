use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct BehaviorConfig {
    pub main_minimize_to_tray: bool,
}

impl Default for BehaviorConfig {
    fn default() -> Self {
        Self {
            main_minimize_to_tray: false,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct BehaviorConfigForUpdate {
    pub main_minimize_to_tray: Option<bool>,
}

pub struct BehaviorCfg;

impl BehaviorCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let config = BehaviorConfig::default();
            Self::save(&config);
        }
    }

    pub fn get() -> BehaviorConfig {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(config) => config,
            Err(_) => {
                let config = BehaviorConfig::default();

                Self::save(&config);

                config
            }
        }
    }

    pub fn save(config: &BehaviorConfig) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: BehaviorConfigForUpdate) -> BehaviorConfig {
        let mut config = Self::get();

        if let Some(main_minimize_to_tray) = data.main_minimize_to_tray {
            config.main_minimize_to_tray = main_minimize_to_tray;
        }

        Self::save(&config);

        ctx.emit_event("behavior_cfg_updated", config.clone());

        config
    }

    fn get_path() -> String {
        utils::get_config_path() + "/behavior.json"
    }
}
