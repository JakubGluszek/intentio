use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::models::Intent;

use super::{CreateTimerSession, SessionType, TimerSession};

#[derive(TS, Serialize, Deserialize, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct QueueSession {
    intent: Intent,
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
    pub fn init() -> Self {
        Self { data: vec![] }
    }
}

impl Queue {
    pub fn is_empty(&self) -> bool {
        println!("timer -> queue -> is empty");
        self.data.is_empty()
    }
    pub fn next(&mut self, session: &mut TimerSession) {
        println!("timer -> queue -> next");
        let session_queue = &mut self.data[0];
        session_queue.iterations -= 1;

        session._type = SessionType::Focus;
        session.duration = session_queue.duration;
        session.intent = session_queue.intent.clone();
        session.time_elapsed = 0;
        session.started_at = None;

        if session_queue.iterations <= 0 {
            self.remove(0)
        };
        println!("queue = {:#?}", self.data);
    }
    pub fn add(&mut self, session: QueueSession) {
        println!("timer -> queue -> add session");
        self.data.push(session);
        println!("queue = {:#?}", self.data);
    }
    pub fn remove(&mut self, idx: usize) {
        println!("timer -> queue -> remove session");
        self.data.remove(idx);
        println!("queue = {:#?}", self.data);
    }
    pub fn reorder(&mut self, idx: usize, target_idx: usize) {
        println!("timer -> queue -> reorder session");
        let session = self.data[idx].clone();
        self.data[idx] = self.data[target_idx].clone();
        self.data[target_idx] = session;
        println!("queue = {:#?}", self.data);
    }
    pub fn clear(&mut self) {
        println!("timer -> queue -> clear queue");
        self.data.clear();
        println!("queue = {:#?}", self.data);
    }
    pub fn increment_session_iterations(&mut self, idx: usize) {
        println!("timer -> queue -> increment session iterations");
        self.data[idx].increment_iterations();
        println!("queue = {:#?}", self.data);
    }
    pub fn decrement_session_iterations(&mut self, idx: usize) {
        println!("timer -> queue -> decrement session iterations");
        self.data[idx].decrement_iterations();
        println!("queue = {:#?}", self.data);
    }
    pub fn update_session_duration(&mut self, idx: usize, duration: i64) {
        println!("timer -> queue -> update session duration");
        self.data[idx].update_duration(duration);
        println!("queue = {:#?}", self.data);
    }
}
