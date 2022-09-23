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

pub enum Storage {
    Root,
    Settings,
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
}
