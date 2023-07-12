use std::sync::{Arc, Mutex};

use crate::{
    bmc::ThemeBmc,
    config::{ConfigManager, QueueConfig, SettingsConfig, TimerConfig},
    ctx::AppContext,
    db::Db,
    prelude::Result,
    state::{AppState, TimerState},
    timer::Timer,
};
use tauri::{App, Manager};
use tauri_hotkey::{Hotkey, HotkeyManager, Key, Modifier};

pub fn setup_hook(app: &mut App) {
    // Disables GTK's scroll bar
    std::env::set_var("GTK_OVERLAY_SCROLLING", "0");

    setup_timer(app);
    setup_database(app).expect("should set up database");
    setup_config().expect("should set up config");
    setup_hotkeys_manager(app).expect("should set up hotkeys");
    setup_state(app).expect("should set up state");
    build_main_window(app).expect("should build main window");
}

fn setup_timer(app: &mut App) {
    let app_handle = app.app_handle();

    let timer = Timer::init(app_handle);

    app.manage(tokio::sync::Mutex::new(timer));
}

fn setup_database(app: &mut App) -> Result<()> {
    let mut conn = Db::setup().expect("the database should be set up");

    let themes = ThemeBmc::get_list(&mut conn)?;
    if themes.len() == 0 {
        ThemeBmc::create_default_themes(&mut conn)?
    }

    app.manage(Mutex::new(conn));
    Ok(())
}

fn setup_config() -> Result<()> {
    if !ConfigManager::verify_root_dir() {
        ConfigManager::create_root_dir()?;
    }

    ConfigManager::validate::<TimerConfig>()?;
    ConfigManager::validate::<SettingsConfig>()?;
    ConfigManager::validate::<QueueConfig>()?;

    Ok(())
}

fn setup_hotkeys_manager(app: &mut App) -> Result<()> {
    let mut hm = HotkeyManager::new();
    let app_handle = Arc::new(app.app_handle());
    let app_handle_clone = app_handle.clone();

    hm.register(
        Hotkey {
            modifiers: vec![Modifier::CTRL],
            keys: vec![Key::F1],
        },
        move || app_handle_clone.emit_all("timer_play", ()).unwrap(),
    )
    .expect("CTRL + F1 failed to register");

    hm.register(
        Hotkey {
            modifiers: vec![Modifier::CTRL],
            keys: vec![Key::F2],
        },
        move || app_handle.emit_all("timer_skip", ()).unwrap(),
    )
    .expect("CTRL + F2 failed to register");

    app.manage(hm);
    Ok(())
}

fn setup_state(app: &mut App) -> Result<()> {
    let app_handle = app.app_handle();
    let settings = ConfigManager::get::<SettingsConfig>()?;

    let idle_theme = app_handle.db(|mut db| ThemeBmc::get(&mut db, settings.idle_theme_id))?;
    let focus_theme = app_handle.db(|mut db| ThemeBmc::get(&mut db, settings.focus_theme_id))?;
    let break_theme = app_handle.db(|mut db| ThemeBmc::get(&mut db, settings.break_theme_id))?;
    let long_break_theme =
        app_handle.db(|mut db| ThemeBmc::get(&mut db, settings.long_break_theme_id))?;

    let app_state = AppState {
        timer: TimerState::default(),
        idle_theme,
        focus_theme,
        break_theme,
        long_break_theme,
    };

    app.manage(Mutex::new(app_state));
    Ok(())
}

fn build_main_window(app: &mut App) -> Result<()> {
    let settings = ConfigManager::get::<SettingsConfig>()?;

    tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("/intents".into()))
        .title("Intentio")
        .inner_size(320f64, 336f64)
        .max_inner_size(320f64, 336f64)
        .min_inner_size(320f64, 336f64)
        .fullscreen(false)
        .resizable(false)
        .decorations(false)
        .always_on_top(settings.main_always_on_top)
        .center()
        .transparent(true)
        .build()?;

    Ok(())
}
