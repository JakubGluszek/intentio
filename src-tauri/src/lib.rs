use chrono::{DateTime, Utc};
use std::{fs, path::Path};

#[derive(Default, serde::Serialize, serde::Deserialize)]
pub struct Settings {
    pub timer: TimerSettings,
    pub theme: ThemeSettings,
    pub alert: AlertSettings,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct TimerSettings {
    pub pomodoro_duration: u32,
    pub break_duration: u32,
    pub long_break_duration: u32,
    pub long_break_interval: u32,
    pub auto_start_pomodoros: bool,
    pub auto_start_breaks: bool,
}

impl Default for TimerSettings {
    fn default() -> Self {
        Self {
            pomodoro_duration: 1500,
            break_duration: 300,
            long_break_duration: 600,
            long_break_interval: 4,
            auto_start_pomodoros: true,
            auto_start_breaks: true,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct ThemeSettings {
    pub current: Theme,
}

impl Default for ThemeSettings {
    fn default() -> Self {
        let contents = fs::read_to_string(Storage::get_path(Storage::Themes)).unwrap();
        let themes: Vec<Theme> = serde_json::from_str(&contents).unwrap();

        Self {
            current: themes[0].clone(),
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct AlertSettings {
    pub name: String,
    pub path: String,
    pub volume: f32,
    pub repeat: u8,
}

impl Default for AlertSettings {
    fn default() -> Self {
        let path = tauri::api::path::audio_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned();

        let path = path + "/pomodoro/default.mp3";

        Self {
            volume: 0.5,
            name: "default.mp3".to_string(),
            path,
            repeat: 2,
        }
    }
}

impl Settings {
    pub fn read() -> Self {
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

    pub fn update(settings: Self) -> Self {
        let path = Storage::get_path(Storage::Settings);
        fs::write(&path, serde_json::to_string_pretty(&settings).unwrap()).unwrap();
        settings
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Pomodoro {
    id: String,
    duration: u32,
    started_at: DateTime<Utc>,
    finished_at: DateTime<Utc>,
    project_id: Option<String>,
}

impl Pomodoro {
    pub fn new(duration: u32, started_at: DateTime<Utc>, project_id: Option<String>) -> Self {
        Self {
            id: cuid::cuid().unwrap(),
            duration,
            started_at,
            finished_at: Utc::now(),
            project_id,
        }
    }

    pub fn save(pomodoro: Self) {
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

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Project {
    id: String,
    title: String,
}

impl Project {
    pub fn new(title: String) -> Self {
        Self {
            id: cuid::cuid().unwrap(),
            title,
        }
    }

    pub fn save(project: Self) -> Vec<Self> {
        let path = Storage::get_path(Storage::Projects);
        let contents = fs::read_to_string(&path).unwrap();

        let mut projects: Vec<Self> = match serde_json::from_str(&contents) {
            Ok(projects) => projects,
            Err(_) => vec![],
        };

        projects.push(project);
        fs::write(&path, serde_json::to_string_pretty(&projects).unwrap()).unwrap();

        projects
    }

    pub fn read() -> Vec<Self> {
        let path = Storage::get_path(Storage::Projects);
        let contents = fs::read_to_string(&path).unwrap();
        match serde_json::from_str(&contents) {
            Ok(projects) => projects,
            Err(_) => {
                let projects = vec![];
                fs::write(&path, serde_json::to_string_pretty(&projects).unwrap()).unwrap();
                projects
            }
        }
    }

    pub fn update(projects: Vec<Self>) -> Vec<Self> {
        let path = Storage::get_path(Storage::Projects);
        fs::write(&path, serde_json::to_string_pretty(&projects).unwrap()).unwrap();
        projects
    }
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Theme {
    id: String,
    name: String,
    colors: Colors,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct Colors {
    window: String,
    base: String,
    primary: String,
    text: String,
}

impl Theme {
    pub fn new(name: String, colors: Colors) -> Self {
        Self {
            id: cuid::cuid().unwrap(),
            name,
            colors,
        }
    }

    pub fn save(theme: Self) -> Vec<Self> {
        let path = Storage::get_path(Storage::Themes);
        let contents = fs::read_to_string(&path).unwrap();

        let mut themes: Vec<Self> = match serde_json::from_str(&contents) {
            Ok(themes) => themes,
            Err(_) => vec![],
        };

        themes.push(theme);
        fs::write(&path, serde_json::to_string_pretty(&themes).unwrap()).unwrap();

        themes
    }

    pub fn read() -> Vec<Self> {
        let path = Storage::get_path(Storage::Themes);
        let contents = fs::read_to_string(&path).unwrap();
        match serde_json::from_str(&contents) {
            Ok(themes) => themes,
            Err(_) => {
                let themes = vec![];
                fs::write(&path, serde_json::to_string_pretty(&themes).unwrap()).unwrap();
                themes
            }
        }
    }

    pub fn update(themes: Vec<Self>) -> Vec<Self> {
        let path = Storage::get_path(Storage::Themes);
        fs::write(&path, serde_json::to_string_pretty(&themes).unwrap()).unwrap();
        themes
    }
}

pub enum Storage {
    Root,
    Settings,
    Pomodoros,
    Projects,
    Themes,
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
            Storage::Projects => "/pomodoro/projects.json",
            Storage::Themes => "/pomodoro/themes.json",
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

        Storage::setup_pomodoros();
        Storage::setup_projects();
        Storage::setup_themes();
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

    fn setup_pomodoros() {
        let path = Storage::get_path(Storage::Pomodoros);
        if !Path::new(&path).is_file() {
            let pomodoros: Vec<Pomodoro> = vec![];
            fs::write(&path, serde_json::to_string_pretty(&pomodoros).unwrap()).unwrap();
        }
    }

    fn setup_projects() {
        let path = Storage::get_path(Storage::Projects);
        if !Path::new(&path).is_file() {
            let projects: Vec<Project> = vec![];
            fs::write(&path, serde_json::to_string_pretty(&projects).unwrap()).unwrap();
        }
    }

    fn setup_themes() {
        let path = Storage::get_path(Storage::Themes);
        if Path::new(&path).is_file() {
            return;
        };

        let contents = fs::read_to_string("./assets/themes.json").unwrap();
        let mut themes: Vec<Theme> = serde_json::from_str(&contents).unwrap();
        for theme in &mut themes {
            *theme = Theme::new(theme.name.clone(), theme.colors.clone());
        }

        fs::write(&path, serde_json::to_string_pretty(&themes).unwrap()).unwrap();
    }
}
