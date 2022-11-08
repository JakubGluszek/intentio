use std::{fs, path::Path, sync::Arc};

use crate::{
    model::{SettingsBmc, ThemeBmc},
    prelude::Result,
    store::Store,
};

pub async fn init(store: Arc<Store>) -> Result<()> {
    init_config_dir();

    ThemeBmc::init(store).await?;
    SettingsBmc::init()?;

    Ok(())
}

pub fn init_config_dir() {
    let config_dir = tauri::api::path::config_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_owned();
    let config_dir = config_dir + "/pomodoro";

    if !Path::new(&config_dir).is_dir() {
        fs::create_dir(config_dir).unwrap();
    }
}
