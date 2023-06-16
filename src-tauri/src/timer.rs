use std::{
    sync::{
        atomic::{AtomicU32, Ordering},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use ts_rs::TS;

use crate::{
    bmc::SessionBmc,
    config::{ConfigManager, TimerConfig},
    ctx::AppContext,
    models::{CreateSession, Intent},
};

type AutoStartNext = bool;

#[derive(Serialize, Debug, Clone, PartialEq)]
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

    fn get_config() -> TimerConfig {
        ConfigManager::get::<TimerConfig>().unwrap()
    }
}

impl TimerSession {
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
        let can_be_saved = self._type == SessionType::Focus
            && self.started_at.is_some()
            && self.time_elapsed >= 60;

        if can_be_saved && intent_id.is_some() {
            let data = CreateSession {
                duration: self.time_elapsed as i32,
                started_at: self.started_at.unwrap(),
                summary: None,
                intent_id: intent_id.unwrap(),
            };
            app_handle
                .db(|mut db| SessionBmc::create(&mut db, &data))
                .unwrap();
        };
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

                let iter_val = iteration.load(Ordering::SeqCst) as i64;
                // Switch over to a long break
                if iter_val > 0 && iter_val % config.long_break_interval == 0 {
                    self.set_long_break_session(&config);
                } else {
                    self.set_break_session(&config);
                }

                iteration.fetch_add(1, Ordering::SeqCst);
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
}

#[derive(TS, Serialize, Deserialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSession {
    intent: Intent,
    duration: u32,
    iterations: u32,
}

impl QueueSession {
    pub fn increment_iterations(&mut self) {
        self.iterations += 1;
    }
    pub fn decrement_iterations(&mut self) {
        if self.iterations > 1 {
            self.iterations -= 1;
        };
    }
    pub fn update_duration(&mut self, duration: u32) {
        self.duration = duration;
    }
}

#[derive(TS, Serialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
struct Queue {
    queue: Vec<QueueSession>,
}

impl Queue {
    pub fn init() -> Self {
        Self { queue: vec![] }
    }
}

impl Queue {
    pub fn add(&mut self, session: QueueSession) {
        println!("timer -> queue -> add session");
        self.queue.push(session);
        println!("queue = {:#?}", self.queue);
    }
    pub fn remove(&mut self, idx: usize) {
        println!("timer -> queue -> remove session");
        self.queue.remove(idx);
        println!("queue = {:#?}", self.queue);
    }
    pub fn reorder(&mut self, idx: usize, target_idx: usize) {
        println!("timer -> queue -> reorder session");
        let session = self.queue[idx].clone();
        self.queue[idx] = self.queue[target_idx].clone();
        self.queue[target_idx] = session;
        println!("queue = {:#?}", self.queue);
    }
    pub fn clear(&mut self) {
        println!("timer -> queue -> clear queue");
        self.queue.clear();
        println!("queue = {:#?}", self.queue);
    }
    pub fn increment_session_iterations(&mut self, idx: usize) {
        println!("timer -> queue -> increment session iterations");
        self.queue[idx].increment_iterations();
        println!("queue = {:#?}", self.queue);
    }
    pub fn decrement_session_iterations(&mut self, idx: usize) {
        println!("timer -> queue -> decrement session iterations");
        self.queue[idx].decrement_iterations();
        println!("queue = {:#?}", self.queue);
    }
    pub fn update_session_duration(&mut self, idx: usize, duration: u32) {
        println!("timer -> queue -> update session duration");
        self.queue[idx].update_duration(duration);
        println!("queue = {:#?}", self.queue);
    }
}

pub struct Timer {
    app_handle: AppHandle,
    session: Arc<Mutex<TimerSession>>,
    iteration: Arc<AtomicU32>,
    intent_id: Arc<Mutex<Option<i32>>>,
    queue: Queue,
}

impl Timer {
    pub fn init(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            session: Arc::new(Mutex::new(TimerSession::init())),
            iteration: Arc::new(AtomicU32::new(0)),
            intent_id: Arc::new(Mutex::new(None)),
            queue: Queue::init(),
        }
    }
}

impl Timer {
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
                // If there is time remaining, skip over to the next loop iteration
                if session.time_elapsed < session.duration * 60 {
                    continue;
                };

                // Switch session
                let auto_start_next =
                    session.next_session(app_handle.clone(), iteration.clone(), intent_id);
                // Determine whether to autostart the next one
                if auto_start_next {
                    session.play();
                    continue;
                };
                // Kill thread
                break;
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

    pub fn add_to_queue(&mut self, session: QueueSession) {
        self.queue.add(session);
    }
    pub fn remove_from_queue(&mut self, idx: usize) {
        self.queue.remove(idx);
    }
    pub fn reorder_queue(&mut self, idx: usize, target_idx: usize) {
        self.queue.reorder(idx, target_idx);
    }
    pub fn clear_queue(&mut self) {
        self.queue.clear();
    }
    pub fn increment_queue_session_iterations(&mut self, idx: usize) {
        self.queue.increment_session_iterations(idx);
    }
    pub fn decrement_queue_session_iterations(&mut self, idx: usize) {
        self.queue.decrement_session_iterations(idx);
    }
    pub fn update_queue_session_duration(&mut self, idx: usize, duration: u32) {
        self.queue.update_session_duration(idx, duration);
    }
}
