use std::sync::{
    atomic::{AtomicU32, Ordering},
    Arc,
};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use ts_rs::TS;

use crate::{
    bmc::SessionBmc,
    config::TimerConfig,
    ctx::AppContext,
    models::{CreateSession, Intent},
};

use super::{Timer, TimerQueue, TimerResult};

type AutoStartNext = bool;

#[derive(TS, Deserialize, Serialize, Debug, Clone, PartialEq)]
#[ts(export, export_to = "../src/bindings/")]
pub enum SessionType {
    Focus,
    Break,
    LongBreak,
}

#[derive(Deserialize, Debug, Clone)]
pub struct CreateTimerSession {
    pub _type: SessionType,
    pub duration: i64,
    pub intent: Intent,
}

#[derive(TS, Serialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TimerSession {
    pub _type: SessionType,
    pub is_playing: bool,
    #[ts(type = "number")]
    pub duration: i64,
    #[ts(type = "number")]
    pub time_elapsed: i64,
    #[ts(type = "number")]
    pub started_at: Option<i64>,
    pub intent: Intent,

    #[serde(skip_serializing)]
    pub app_handle: AppHandle,
}

impl TimerSession {
    pub fn new(app_handle: AppHandle, data: CreateTimerSession) -> Self {
        Self {
            _type: data._type,
            duration: data.duration,
            intent: data.intent,
            is_playing: false,
            time_elapsed: 0,
            started_at: None,
            app_handle,
        }
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

    pub fn emit(&self) {
        self.app_handle
            .emit_all("timer_session_updated", self.clone())
            .unwrap();
    }

    pub fn save(&self) {
        let can_be_saved = self._type == SessionType::Focus
            && self.started_at.is_some()
            && self.time_elapsed >= 60;

        if can_be_saved {
            let data = CreateSession {
                duration: self.time_elapsed as i32,
                started_at: self.started_at.unwrap(),
                intent_id: self.intent.id,
            };
            let session_id = self
                .app_handle
                .db(|mut db| SessionBmc::create(&mut db, &data))
                .unwrap();
            self.app_handle
                .emit_all("session_created", session_id)
                .unwrap();
        };
    }

    pub fn next_session(
        &mut self,
        iteration: Arc<AtomicU32>,
        queue: &mut TimerQueue,
    ) -> TimerResult<AutoStartNext> {
        let config = Timer::get_config();
        let auto_start_next = match self._type {
            SessionType::Focus => {
                // Try to save session before switching to a break
                self.save();

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
                if queue.is_empty() {
                    self.set_focus_session(&config);
                } else {
                    queue.next(self)?;
                };
                config.auto_start_focus
            }
        };
        if !auto_start_next {
            self.stop();
        };
        self.emit();
        Ok(auto_start_next)
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
