use std::{fs, sync::Arc, path::Path};

use crate::{ctx::Ctx, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Behavior {
    pub main_minimize_to_tray: bool,
}

impl Default for Behavior {
    fn default() -> Self {
        Self {
            main_minimize_to_tray: false,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct BehaviorForUpdate {
    pub main_minimize_to_tray: Option<bool>,
}

pub struct BehaviorCfg;

impl BehaviorCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let behavior = Behavior::default();
            Self::save(&behavior);
        }
    }

    pub fn get() -> Behavior {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(behavior) => behavior,
            Err(_) => {
                let behavior = Behavior::default();

                Self::save(&behavior);

                behavior
            }
        }
    }

    pub fn save(config: &Behavior) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: BehaviorForUpdate) {
        let mut behavior = Self::get();

        if let Some(main_minimize_to_tray) = data.main_minimize_to_tray {
            behavior.main_minimize_to_tray = main_minimize_to_tray;
        }

        Self::save(&behavior);

        // emit update event
    }

    fn get_path() -> String {
        utils::get_config_path() + "/behavior.json"
    }
}
