use std::sync::Arc;

use crate::{
    config::{ConfigManager, SettingsConfig, TimerConfig},
    ctx::Ctx,
    database::Database,
    models::ThemeBmc,
    prelude::Result,
    state::{AppState, TimerState},
};
use tauri::{App, Manager};
use tauri_hotkey::{Hotkey, HotkeyManager, Key, Modifier};

pub async fn setup_database() -> Result<Arc<Database>> {
    let database = Database::new().await?;
    let database = Arc::new(database);

    ThemeBmc::init_default_themes(database.clone()).await?;

    Ok(database)
}

pub async fn setup_hook(app: &mut App) {
    setup_config().expect("initial config setup");
    setup_hotkeys_manager(app).expect("initial setup of hotkeys");
    setup_state(app).await.expect("initial state setup");
    build_main_window(app).expect("initial main window build");
}

fn setup_config() -> Result<()> {
    if !ConfigManager::verify_root_dir() {
        ConfigManager::create_root_dir()?;
    }

    ConfigManager::validate::<TimerConfig>()?;
    ConfigManager::validate::<SettingsConfig>()?;

    Ok(())
}

fn setup_hotkeys_manager(app: &mut App) -> Result<()> {
    let ctx = Ctx::from_app(app.app_handle())?;

    let mut hm = HotkeyManager::new();
    let ctx_clone = ctx.clone();

    hm.register(
        Hotkey {
            modifiers: vec![Modifier::CTRL],
            keys: vec![Key::F1],
        },
        move || ctx_clone.emit_event("timer_play", ()),
    )
    .expect("CTRL + F1 failed to register");

    hm.register(
        Hotkey {
            modifiers: vec![Modifier::CTRL],
            keys: vec![Key::F2],
        },
        move || ctx.emit_event("timer_skip", ()),
    )
    .expect("CTRL + F2 failed to register");

    app.manage(hm);

    Ok(())
}

async fn setup_state(app: &mut App) -> Result<()> {
    let ctx = Ctx::from_app(app.app_handle())?;
    let settings = ConfigManager::get::<SettingsConfig>()?;

    // handle possible error caused by theme_ids pointing to models which don't exist
    let idle_theme = ThemeBmc::get(ctx.clone(), &settings.idle_theme_id).await?;
    let focus_theme = ThemeBmc::get(ctx.clone(), &settings.focus_theme_id).await?;
    let break_theme = ThemeBmc::get(ctx.clone(), &settings.break_theme_id).await?;
    let long_break_theme = ThemeBmc::get(ctx.clone(), &settings.long_break_theme_id).await?;

    let app_state = AppState {
        timer: TimerState::default(),
        focus_theme,
        idle_theme,
        break_theme,
        long_break_theme,
    };

    app.manage(tokio::sync::Mutex::new(app_state));

    Ok(())
}

fn build_main_window(app: &mut App) -> Result<()> {
    let settings = ConfigManager::get::<SettingsConfig>()?;

    tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("/".into()))
        .title("Intentio")
        .inner_size(300f64, 320f64)
        .max_inner_size(300f64, 320f64)
        .min_inner_size(300f64, 320f64)
        .fullscreen(false)
        .resizable(false)
        .decorations(false)
        .always_on_top(settings.main_always_on_top)
        .center()
        .transparent(true)
        .build()?;

    Ok(())
}
