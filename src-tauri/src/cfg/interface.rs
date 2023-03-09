use std::{fs, path::Path, sync::Arc};

use crate::{ctx::Ctx, prelude::DEFAULT_THEME, utils};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, PartialEq, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct InterfaceConfig {
    pub theme_id: String,
    pub display_timer_countdown: bool,
}

impl Default for InterfaceConfig {
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
pub struct InterfaceConfigForUpdate {
    pub theme_id: Option<String>,
    pub display_timer_countdown: Option<bool>,
}

pub struct InterfaceCfg;

impl InterfaceCfg {
    pub fn setup() {
        let path = Self::get_path();

        if !Path::new(&path).is_file() {
            let interface = InterfaceConfig::default();
            Self::save(&interface);
        }
    }

    pub fn get() -> InterfaceConfig {
        let path = Self::get_path();
        let contents = fs::read_to_string(path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(config) => config,
            Err(_) => {
                let config = InterfaceConfig::default();

                Self::save(&config);

                config
            }
        }
    }

    pub fn save(config: &InterfaceConfig) {
        let path = Self::get_path();
        let content = serde_json::to_string_pretty(&config).unwrap();

        fs::write(&path, content).unwrap();
    }

    pub fn update(ctx: Arc<Ctx>, data: InterfaceConfigForUpdate) -> InterfaceConfig {
        let mut config = Self::get();

        if let Some(theme_id) = data.theme_id {
            config.theme_id = theme_id;
        }
        if let Some(display_timer_countdown) = data.display_timer_countdown {
            config.display_timer_countdown = display_timer_countdown;
        }

        Self::save(&config);

        ctx.emit_event("interface_cfg_updated", config.clone());

        config
    }

    fn get_path() -> String {
        utils::get_config_path() + "/interface.json"
    }
}

#[cfg(test)]
mod tests {}
