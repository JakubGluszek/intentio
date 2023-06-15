use std::{
    sync::{
        atomic::{AtomicU32, Ordering},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use serde::Serialize;
use tauri::{AppHandle, Manager};

use crate::{
    bmc::SessionBmc,
    config::{ConfigManager, TimerConfig},
    ctx::AppContext,
    models::CreateSession,
};

#[derive(Serialize, Debug, Clone)]
pub enum SessionType {
    Focus,
    Break,
    LongBreak,
}

#[derive(Serialize, Debug, Clone)]
pub struct TimerSession {
    pub _type: SessionType,
    pub is_playing: bool,
    pub duration: i64,
    pub time_elapsed: i64,
    pub started_at: Option<i64>,
}

type AutoStartNext = bool;

impl TimerSession {
    pub fn init() -> Self {
        let config = Self::get_config();

        Self {
            _type: SessionType::Focus,
            is_playing: false,
            duration: config.focus_duration,
            time_elapsed: 0,
            started_at: None,
        }
    }

    pub fn play(&mut self) {
        if let None = self.started_at {
            let timestamp = chrono::Utc::now().timestamp();
            self.started_at = Some(timestamp);
        }
        self.is_playing = true;
    }

    pub fn stop(&mut self) {
        self.is_playing = false;
    }

    pub fn restart(&mut self) {
        self.time_elapsed = 0;
        self.started_at = None;
    }

    pub fn emit_state(&self, app_handle: AppHandle) {
        app_handle
            .emit_all("timer_session_updated", self.clone())
            .unwrap();
    }

    pub fn save(&self, app_handle: AppHandle, intent_id: Option<i32>) {
        if intent_id.is_none() {
            return;
        };
        if self.started_at.is_some() || self.duration >= 60 {
            let data = CreateSession {
                duration: self.time_elapsed as i32,
                started_at: self.started_at.unwrap(),
                summary: None,
                intent_id: intent_id.unwrap(),
            };
            app_handle
                .db(|mut db| SessionBmc::create(&mut db, &data))
                .unwrap();
        }
    }

    fn next_session(
        &mut self,
        app_handle: AppHandle,
        iteration: Arc<AtomicU32>,
        intent_id: Option<i32>,
    ) -> AutoStartNext {
        let config = Self::get_config();
        let auto_start_next = match self._type {
            SessionType::Focus => {
                // Try to save session before switching to a break
                self.save(app_handle.clone(), intent_id);

                let iter_val = iteration.fetch_add(1, Ordering::SeqCst) as i64;
                // Switch over to a long break
                if iter_val > 0 && iter_val % config.long_break_interval == 0 {
                    self.set_long_break_session(&config);
                } else {
                    self.set_break_session(&config);
                }
                config.auto_start_breaks
            }
            _ => {
                self.set_focus_session(&config);
                config.auto_start_focus
            }
        };
        if !auto_start_next {
            self.stop();
        };
        self.emit_state(app_handle);
        auto_start_next
    }

    fn set_focus_session(&mut self, config: &TimerConfig) {
        self._type = SessionType::Focus;
        self.duration = config.focus_duration;
        self.time_elapsed = 0;
        self.started_at = None;
    }

    fn set_break_session(&mut self, config: &TimerConfig) {
        self._type = SessionType::Break;
        self.duration = config.break_duration;
        self.time_elapsed = 0;
        self.started_at = None;
    }

    fn set_long_break_session(&mut self, config: &TimerConfig) {
        self._type = SessionType::LongBreak;
        self.duration = config.long_break_duration;
        self.time_elapsed = 0;
        self.started_at = None;
    }

    fn get_config() -> TimerConfig {
        ConfigManager::get::<TimerConfig>().unwrap()
    }
}

pub struct Timer {
    app_handle: AppHandle,
    session: Arc<Mutex<TimerSession>>,
    iteration: Arc<AtomicU32>,
    intent_id: Arc<Mutex<Option<i32>>>,
}

impl Timer {
    pub fn init(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            session: Arc::new(Mutex::new(TimerSession::init())),
            iteration: Arc::new(AtomicU32::new(0)),
            intent_id: Arc::new(Mutex::new(None)),
        }
    }

    pub fn play(&mut self) {
        let mut session = self.session.lock().unwrap();
        let intent_id = self.intent_id.lock().unwrap();
        // Exit function if session is already playing
        if session.is_playing || intent_id.is_none() {
            return;
        }
        session.play();

        let session = self.session.clone();
        let app_handle = self.app_handle.clone();
        let iteration = self.iteration.clone();
        let intent_id = intent_id.clone();
        // Run timer logic inside of a new thread
        thread::spawn(move || {
            loop {
                thread::sleep(Duration::from_secs(1));

                let mut session = session.lock().unwrap();
                // Kills thread if session has been paused
                if !session.is_playing {
                    break;
                }
                // Increments elapsed time
                session.time_elapsed += 1;
                session.emit_state(app_handle.clone());
                if session.time_elapsed < session.duration * 60 {
                    continue;
                };
                let auto_start_next =
                    session.next_session(app_handle.clone(), iteration.clone(), intent_id);
                if !auto_start_next {
                    break;
                }
            }
        });
    }

    pub fn stop(&mut self) {
        let mut session = self.session.lock().unwrap();
        session.stop();
        session.emit_state(self.app_handle.clone());
    }

    pub fn restart(&mut self) {
        let mut session = self.session.lock().unwrap();
        let app_handle = self.app_handle.clone();
        let intent_id = *self.intent_id.lock().unwrap();

        session.stop();
        session.save(app_handle, intent_id);
        session.restart();
        session.emit_state(self.app_handle.clone());
    }

    pub fn skip(&mut self) {
        let mut session = self.session.lock().unwrap();
        let iteration = self.iteration.clone();
        let intent_id = *self.intent_id.lock().unwrap();
        session.stop();
        session.next_session(self.app_handle.clone(), iteration, intent_id);
    }

    pub fn set_intent_id(&mut self, id: i32) {
        *self.intent_id.lock().unwrap() = Some(id);
    }
}
