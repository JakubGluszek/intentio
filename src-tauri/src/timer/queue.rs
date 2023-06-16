use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::models::Intent;

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
pub struct Queue {
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
