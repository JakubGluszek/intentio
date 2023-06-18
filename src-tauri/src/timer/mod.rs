use crate::{
    config::{ConfigManager, TimerConfig},
    models::Intent,
};
use std::{
    sync::{atomic::AtomicU32, Arc, Mutex, MutexGuard},
    thread,
    time::Duration,
};
use tauri::AppHandle;

mod error;
mod queue;
mod session;

pub use error::*;
pub use queue::*;
pub use session::*;

type TimerResult<T> = Result<T, TimerError>;

pub struct Timer {
    session: Option<Arc<Mutex<TimerSession>>>,
    iteration: Arc<AtomicU32>,
    queue: Arc<Mutex<TimerQueue>>,
}

// Static timer methods
impl Timer {
    pub fn init(app_handle: AppHandle) -> Self {
        Self {
            session: None,
            iteration: Arc::new(AtomicU32::new(0)),
            queue: Arc::new(Mutex::new(TimerQueue::new(app_handle))),
        }
    }
    fn get_config() -> TimerConfig {
        ConfigManager::get::<TimerConfig>().unwrap()
    }
}

// Methods for interacting with timer
impl Timer {
    pub fn play(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard()?;
        // Exit function if session is already playing
        if session.is_playing {
            return Ok(());
        }
        session.play();

        let session = self.get_session_clone()?;
        let iteration = self.iteration.clone();
        let queue = self.queue.clone();

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
                session.emit();
                // If there is time remaining, skip over to the next loop iteration
                if session.time_elapsed < session.duration * 60 {
                    continue;
                };

                let mut queue = queue.lock().unwrap();
                // Switch session
                let auto_start_next = session.next_session(iteration.clone(), &mut queue);
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
        let mut session = self.get_session_guard()?;
        session.stop();
        session.emit();
        Ok(())
    }
    pub fn restart(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard()?;

        session.stop();
        session.save();
        session.restart();
        session.emit();
        Ok(())
    }
    pub fn skip(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard()?;
        let iteration = self.iteration.clone();
        let queue_guard = self.queue.clone();
        let mut queue = queue_guard.lock().unwrap();

        session.stop();
        session.next_session(iteration, &mut *queue);
        Ok(())
    }
}

// Helper methods
impl Timer {
    fn get_session_clone(&self) -> TimerResult<Arc<Mutex<TimerSession>>> {
        if let Some(session) = &self.session {
            return Ok(session.clone());
        };
        Err(TimerError::UndefinedSession)
    }
    fn get_session_guard(&self) -> Result<MutexGuard<TimerSession>, TimerError> {
        let session = self.session.as_ref().ok_or(TimerError::UndefinedSession)?;
        let session_guard = session.lock().unwrap();
        Ok(session_guard)
    }
}

// Session related methods
impl Timer {
    pub fn get_session(&self) -> TimerResult<TimerSession> {
        let session = self.get_session_guard()?.clone();
        Ok(session)
    }
    pub fn set_session_intent(&mut self, app_handle: AppHandle, intent: Intent) {
        match &mut self.session {
            Some(session) => {
                let mut session = session.lock().unwrap();
                session.intent = intent;
                session.emit();
            }
            None => {
                let config = Self::get_config();
                let data = CreateTimerSession {
                    _type: SessionType::Focus,
                    duration: config.focus_duration,
                    intent,
                };
                let session = TimerSession::new(app_handle, data);
                session.emit();
                self.session = Some(Arc::new(Mutex::new(session)));
            }
        }
    }
}

// Methods for interacting with the timer's queue
impl Timer {
    pub fn get_queue(&self) -> Queue {
        self.queue.lock().unwrap().get()
    }
    pub fn add_to_queue(&mut self, session: QueueSession) {
        let mut queue = self.queue.lock().unwrap();
        queue.add(session);
    }
    pub fn remove_from_queue(&mut self, idx: usize) {
        let mut queue = self.queue.lock().unwrap();
        queue.remove(idx);
    }
    pub fn reorder_queue(&mut self, idx: usize, target_idx: usize) {
        let mut queue = self.queue.lock().unwrap();
        queue.reorder(idx, target_idx);
    }
    pub fn clear_queue(&mut self) {
        let mut queue = self.queue.lock().unwrap();
        queue.clear();
    }
    pub fn increment_queue_session_iterations(&mut self, idx: usize) {
        let mut queue = self.queue.lock().unwrap();
        queue.increment_session_iterations(idx);
    }
    pub fn decrement_queue_session_iterations(&mut self, idx: usize) {
        let mut queue = self.queue.lock().unwrap();
        queue.decrement_session_iterations(idx);
    }
    pub fn update_queue_session_duration(&mut self, idx: usize, duration: i64) {
        let mut queue = self.queue.lock().unwrap();
        queue.update_session_duration(idx, duration);
    }
}
