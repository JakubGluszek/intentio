use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, prelude::DEFAULT_THEME, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Interface {
    pub theme_id: String,
    pub display_timer_countdown: bool,
}

impl Default for Interface {
    fn default() -> Self {
        Self {
            theme_id: DEFAULT_THEME.to_string(),
            display_timer_countdown: true,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct InterfaceForUpdate {
    pub theme_id: Option<String>,
    pub display_timer_countdown: Option<bool>,
}

pub struct InterfaceCfg;

impl InterfaceCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let interface = Interface::default();
            Self::save(&interface);
        }
    }

    pub fn get() -> Interface {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(interface) => interface,
            Err(_) => {
                let interface = Interface::default();

                Self::save(&interface);

                interface
            }
        }
    }

    pub fn save(config: &Interface) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: InterfaceForUpdate) {
        let mut interface = Self::get();

        if let Some(theme_id) = data.theme_id {
            interface.theme_id = theme_id;
        }
        if let Some(display_timer_countdown) = data.display_timer_countdown {
            interface.display_timer_countdown = display_timer_countdown;
        }

        Self::save(&interface);

        // emit update event
    }

    fn get_path() -> String {
        utils::get_config_path() + "/interface.json"
    }
}

#[cfg(test)]
mod tests {}
