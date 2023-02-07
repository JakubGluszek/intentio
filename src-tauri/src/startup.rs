use std::{fs, path::Path, sync::Arc};

use crate::{
    model::{SettingsBmc, ThemeBmc},
    prelude::Result,
    store::Store,
};

pub async fn init(store: Arc<Store>) -> Result<()> {
    init_config_dir();
    init_scripts_dir();

    ThemeBmc::init(store).await?;
    SettingsBmc::init()?;

    Ok(())
}

fn get_config_dir() -> String {
    let config_dir = tauri::api::path::config_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_owned();
    let config_dir = config_dir + "/intentio";
    config_dir
}

fn init_config_dir() {
    let config_dir = get_config_dir();

    if !Path::new(&config_dir).is_dir() {
        fs::create_dir(config_dir).unwrap();
    }
}

fn init_scripts_dir() {
    let config_dir = get_config_dir();
    let scripts_dir = config_dir + "/scripts";

    if !Path::new(&scripts_dir).is_dir() {
        fs::create_dir(scripts_dir).unwrap();
    }
}
