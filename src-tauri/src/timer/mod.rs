mod error;
mod queue;
mod session;

pub use error::*;
pub use queue::*;
pub use session::*;

use std::{
    sync::{atomic::AtomicU32, Arc, Mutex},
    thread,
    time::Duration,
};

use tauri::AppHandle;

use crate::{
    config::{ConfigManager, TimerConfig},
    models::Intent,
};

type TimerResult<T> = Result<T, TimerError>;

pub struct Timer {
    app_handle: AppHandle,
    session: Option<Arc<Mutex<TimerSession>>>,
    iteration: Arc<AtomicU32>,
    queue: Queue,
}

impl Timer {
    pub fn init(app_handle: AppHandle) -> Self {
        Self {
            app_handle,
            session: None,
            iteration: Arc::new(AtomicU32::new(0)),
            queue: Queue::init(),
        }
    }

    fn get_config() -> TimerConfig {
        ConfigManager::get::<TimerConfig>().unwrap()
    }
}

impl Timer {
    pub fn get_session(&self) -> TimerResult<TimerSession> {
        let session = self.get_session_clone()?;
        let session = session.lock().unwrap().clone();
        Ok(session)
    }
    pub fn set_session_intent(&mut self, intent: Intent) {
        match &mut self.session {
            Some(session) => {
                let mut session = session.lock().unwrap();
                session.intent = intent;
                session.emit_state(self.app_handle.clone())
            }
            None => {
                let config = Self::get_config();
                let data = CreateTimerSession {
                    _type: SessionType::Focus,
                    duration: config.focus_duration,
                    intent,
                };
                let session = TimerSession::new(data);
                session.emit_state(self.app_handle.clone());
                self.session = Some(Arc::new(Mutex::new(session)));
            }
        }
    }

    pub fn play(&mut self) -> TimerResult<()> {
        let session_guard = self.get_session_clone()?;
        let mut session = session_guard.lock().unwrap();
        // Exit function if session is already playing
        if session.is_playing {
            return Ok(());
        }
        session.play();

        let session = self.get_session_clone()?;
        let app_handle = self.app_handle.clone();
        let iteration = self.iteration.clone();
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
                let auto_start_next = session.next_session(app_handle.clone(), iteration.clone());
                // Determine whether to autostart the next one
                if auto_start_next {
                    session.play();
                    continue;
                };
                // Kill thread
                break;
            }
        });
        Ok(())
    }
    pub fn stop(&mut self) -> TimerResult<()> {
        let session_guard = self.get_session_clone()?;
        let mut session = session_guard.lock().unwrap();
        session.stop();
        session.emit_state(self.app_handle.clone());
        Ok(())
    }
    pub fn restart(&mut self) -> TimerResult<()> {
        let session_guard = self.get_session_clone()?;
        let mut session = session_guard.lock().unwrap();
        let app_handle = self.app_handle.clone();

        session.stop();
        session.save(app_handle);
        session.restart();
        session.emit_state(self.app_handle.clone());
        Ok(())
    }
    pub fn skip(&mut self) -> TimerResult<()> {
        let session_guard = self.get_session_clone()?;
        let mut session = session_guard.lock().unwrap();
        let iteration = self.iteration.clone();

        session.stop();
        session.next_session(self.app_handle.clone(), iteration);
        Ok(())
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

    fn get_session_clone(&self) -> TimerResult<Arc<Mutex<TimerSession>>> {
        if let Some(session) = &self.session {
            return Ok(session.clone());
        };
        Err(TimerError::UndefinedSession)
    }
}
