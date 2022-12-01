use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{SettingsBmc, Theme, ThemeBmc},
};

#[command]
pub async fn get_current_theme(app: AppHandle<Wry>) -> Result<Theme, ()> {
    match Ctx::from_app(app) {
        Ok(ctx) => {
            let settings = SettingsBmc::get().unwrap();
            match ThemeBmc::get(ctx, &settings.current_theme_id).await {
                Ok(theme) => Ok(theme),
                Err(_) => Err(()),
            }
        }
        Err(_) => Err(()),
    }
}
