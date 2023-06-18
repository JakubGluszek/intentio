use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use ts_rs::TS;

use super::{SessionType, TimerError, TimerResult, TimerSession};
use crate::models::Intent;

#[derive(TS, Serialize, Deserialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSession {
    intent: Intent,
    #[ts(type = "number")]
    duration: i64,
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
    pub fn update_duration(&mut self, duration: i64) {
        self.duration = duration;
    }
}

#[derive(TS, Serialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Queue {
    data: Vec<QueueSession>,
}

impl Queue {
    pub fn new() -> Self {
        Self { data: vec![] }
    }
}

#[derive(Debug, Clone)]
pub struct TimerQueue {
    queue: Queue,
    app_handle: AppHandle,
}

impl TimerQueue {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            queue: Queue::new(),
            app_handle,
        }
    }
}

impl TimerQueue {
    pub fn get(&self) -> Queue {
        self.queue.clone()
    }
    pub fn emit(&self) {
        self.app_handle
            .emit_all("timer_queue_updated", self.get())
            .unwrap();
    }

    pub fn is_empty(&self) -> bool {
        self.queue.data.is_empty()
    }
    pub fn next(&mut self, session: &mut TimerSession) -> TimerResult<()> {
        if self.is_empty() {
            return Err(TimerError::EmptyQueue);
        };
        let session_queue = &mut self.queue.data[0];
        session_queue.iterations -= 1;

        session._type = SessionType::Focus;
        session.duration = session_queue.duration;
        session.intent = session_queue.intent.clone();
        session.time_elapsed = 0;
        session.started_at = None;

        if session_queue.iterations <= 0 {
            self.remove(0)?;
        };
        self.emit();
        Ok(())
    }
    pub fn add(&mut self, session: QueueSession) {
        self.queue.data.push(session);
        self.emit();
    }
    pub fn remove(&mut self, idx: usize) -> TimerResult<()> {
        self.validate_index_in_range(idx)?;
        self.queue.data.remove(idx);
        self.emit();
        Ok(())
    }
    pub fn reorder(&mut self, idx: usize, target_idx: usize) -> TimerResult<()> {
        self.validate_index_in_range(idx)?;
        self.validate_index_in_range(target_idx)?;
        let session = self.queue.data[idx].clone();
        self.queue.data[idx] = self.queue.data[target_idx].clone();
        self.queue.data[target_idx] = session;
        self.emit();
        Ok(())
    }
    pub fn clear(&mut self) {
        self.queue.data.clear();
        self.emit();
    }
    pub fn increment_session_iterations(&mut self, idx: usize) -> TimerResult<()> {
        self.validate_index_in_range(idx)?;
        self.queue.data[idx].increment_iterations();
        self.emit();
        Ok(())
    }
    pub fn decrement_session_iterations(&mut self, idx: usize) -> TimerResult<()> {
        self.validate_index_in_range(idx)?;
        self.queue.data[idx].decrement_iterations();
        self.emit();
        Ok(())
    }
    pub fn update_session_duration(&mut self, idx: usize, duration: i64) -> TimerResult<()> {
        self.validate_index_in_range(idx)?;
        self.queue.data[idx].update_duration(duration);
        self.emit();
        Ok(())
    }

    fn validate_index_in_range(&self, idx: usize) -> TimerResult<()> {
        if self.queue.data.len() <= idx {
            return Err(TimerError::QueueIndexOutOfRange);
        };
        Ok(())
    }
}
