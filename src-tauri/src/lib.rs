use chrono::{DateTime, Utc};
use std::{fs, path::Path};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Settings {
    pomodoro_duration: u32,
    break_duration: u32,
    is_long_break: bool,
    long_break_duration: u32,
    long_break_interval: u32,
    auto_start_pomodoros: bool,
    auto_start_breaks: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            pomodoro_duration: 1500,
            break_duration: 300,
            is_long_break: true,
            long_break_duration: 600,
            long_break_interval: 4,
            auto_start_pomodoros: true,
            auto_start_breaks: true,
        }
    }
}

impl Settings {
    pub fn read() -> Settings {
        let path = Storage::get_path(Storage::Settings);
        let contents = fs::read_to_string(&path).unwrap();

        match serde_json::from_str(&contents) {
            Ok(settings) => settings,
            Err(_) => {
                let settings = Settings::default();
                fs::write(&path, serde_json::to_string_pretty(&settings).unwrap()).unwrap();
                settings
            }
        }
    }

    pub fn update(settings: Settings) -> Settings {
        let path = Storage::get_path(Storage::Settings);
        fs::write(&path, serde_json::to_string_pretty(&settings).unwrap()).unwrap();
        settings
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Pomodoro {
    id: String,
    duration: u32,
    started_at: DateTime<Utc>,
    finished_at: DateTime<Utc>,
}

impl Pomodoro {
    pub fn new(duration: u32, started_at: DateTime<Utc>) -> Self {
        Self {
            id: cuid::cuid().unwrap(),
            duration,
            started_at,
            finished_at: Utc::now(),
        }
    }

    pub fn save(pomodoro: Pomodoro) {
        let path = Storage::get_path(Storage::Pomodoros);
        let contents = fs::read_to_string(&path).unwrap();

        let mut pomodoros: Vec<Pomodoro> = match serde_json::from_str(&contents) {
            Ok(pomodoros) => pomodoros,
            Err(_) => vec![],
        };

        pomodoros.push(pomodoro);
        fs::write(&path, serde_json::to_string_pretty(&pomodoros).unwrap()).unwrap();
    }

    pub fn read() -> Vec<Pomodoro> {
        let path = Storage::get_path(Storage::Pomodoros);
        let contents = fs::read_to_string(&path).unwrap();
        match serde_json::from_str(&contents) {
            Ok(pomodoros) => pomodoros,
            Err(_) => {
                let pomodoros = vec![];
                fs::write(&path, serde_json::to_string_pretty(&pomodoros).unwrap()).unwrap();
                pomodoros
            }
        }
    }
}

pub enum Storage {
    Root,
    Settings,
    Pomodoros,
}

impl Storage {
    fn get_path(target: Storage) -> String {
        let mut path = tauri::api::path::data_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned();

        let target = match target {
            Storage::Root => "/pomodoro",
            Storage::Settings => "/pomodoro/settings.json",
            Storage::Pomodoros => "/pomodoro/pomodoros.json",
        };

        path.push_str(target);
        path
    }

    pub fn setup() {
        let root_path = Storage::get_path(Storage::Root);
        let is_root = Path::new(&root_path).is_dir();
        if !is_root {
            fs::create_dir(root_path).unwrap();
        }

        Storage::setup_settings();
        Storage::setup_pomodoros();
    }

    fn setup_settings() {
        let path = Storage::get_path(Storage::Settings);
        if !Path::new(&path).is_file() {
            fs::write(
                &path,
                serde_json::to_string_pretty(&Settings::default()).unwrap(),
            )
            .unwrap();
        }
    }

    fn setup_pomodoros() {
        let path = Storage::get_path(Storage::Pomodoros);
        if !Path::new(&path).is_file() {
            let pomodoros: Vec<Pomodoro> = vec![];
            fs::write(&path, serde_json::to_string_pretty(&pomodoros).unwrap()).unwrap();
        }
    }
}
