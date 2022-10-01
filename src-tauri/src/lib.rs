use chrono::{DateTime, Utc};
use std::{fs, path::Path};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Settings {
    pomodoro_duration: u32,
    break_duration: u32,
    long_break_duration: u32,
    long_break_interval: u32,
    auto_start_pomodoros: bool,
    auto_start_breaks: bool,
    alert: AlertSettings,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            pomodoro_duration: 1500,
            break_duration: 300,
            long_break_duration: 600,
            long_break_interval: 4,
            auto_start_pomodoros: true,
            auto_start_breaks: true,
            alert: AlertSettings::default(),
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

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct AlertSettings {
    sound: String,
    volume: u8,
    repeat: u32,
}

impl Default for AlertSettings {
    fn default() -> Self {
        Self {
            sound: "".to_string(),
            volume: 50,
            repeat: 1,
        }
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
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

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Theme {
    id: String,
    name: String,
    colors: Colors,
}

#[derive(serde::Serialize, serde::Deserialize)]
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

#[derive(serde::Deserialize, serde::Serialize)]
pub struct State {
    theme: Theme,
}

impl Default for State {
    fn default() -> Self {
        Self {
            theme: Theme::new(
                "abyss".to_string(),
                Colors {
                    window: "#222831".to_string(),
                    base: "#393E46".to_string(),
                    primary: "#00ADB5".to_string(),
                    text: "#EEEEEE".to_string(),
                },
            ),
        }
    }
}

impl State {
    pub fn read() -> Self {
        let path = Storage::get_path(Storage::State);
        let contents = fs::read_to_string(&path).unwrap();
        match serde_json::from_str(&contents) {
            Ok(state) => state,
            Err(_) => {
                let state = State::default();
                fs::write(&path, serde_json::to_string_pretty(&state).unwrap()).unwrap();
                state
            }
        }
    }

    pub fn update(state: Self) -> Self {
        let path = Storage::get_path(Storage::State);
        fs::write(&path, serde_json::to_string_pretty(&state).unwrap()).unwrap();
        state
    }
}

pub enum Storage {
    Root,
    Settings,
    Pomodoros,
    Projects,
    Themes,
    State,
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
            Storage::State => "/pomodoro/state.json",
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
        Storage::setup_projects();
        Storage::setup_themes();
        Storage::setup_state();
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

        let themes: Vec<Theme> = vec![
            Theme::new(
                "abyss".to_string(),
                Colors {
                    window: "#222831".to_string(),
                    base: "#393E46".to_string(),
                    primary: "#00ADB5".to_string(),
                    text: "#EEEEEE".to_string(),
                },
            ),
            Theme::new(
                "winter".to_string(),
                Colors {
                    window: "#F9F7F7".to_string(),
                    base: "#DBE2EF".to_string(),
                    primary: "#3F72AF".to_string(),
                    text: "#112D4E".to_string(),
                },
            ),
            Theme::new(
                "cyan".to_string(),
                Colors {
                    window: "#232931".to_string(),
                    base: "#393E46".to_string(),
                    primary: "#4ECCA3".to_string(),
                    text: "#EEEEEE".to_string(),
                },
            ),
            Theme::new(
                "jungle".to_string(),
                Colors {
                    window: "#191A19".to_string(),
                    base: "#1E5128".to_string(),
                    primary: "#4E9F3D".to_string(),
                    text: "#D8E9A8".to_string(),
                },
            ),
        ];

        fs::write(&path, serde_json::to_string_pretty(&themes).unwrap()).unwrap();
    }

    fn setup_state() {
        let path = Storage::get_path(Storage::State);
        if !Path::new(&path).is_file() {
            let state = State::default();
            fs::write(&path, serde_json::to_string_pretty(&state).unwrap()).unwrap();
        }
    }
}
