use crate::{
    config::{ConfigManager, TimerConfig},
    models::Intent,
};
use std::sync::atomic::AtomicU32;
use std::sync::Arc;
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tokio::time::sleep;
use tokio::{
    sync::{Mutex, OwnedMutexGuard},
    task::JoinHandle,
};

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
    session_handle: Option<JoinHandle<()>>,
}

// Static timer methods
impl Timer {
    pub fn init(app_handle: AppHandle) -> Self {
        Self {
            session: None,
            iteration: Arc::new(AtomicU32::new(0)),
            queue: Arc::new(Mutex::new(TimerQueue::new(app_handle))),
            session_handle: None,
        }
    }
    fn get_config() -> TimerConfig {
        ConfigManager::get::<TimerConfig>().unwrap()
    }
}

// Methods for interacting with timer
impl Timer {
    pub async fn play(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard().await?;
        // Exit function if session is already playing
        if session.is_playing {
            return Ok(());
        }

        session.play();
        session.emit();

        let session = self.get_session_clone().await?;
        let iteration = self.iteration.clone();
        let queue = self.queue.clone();

        // Run timer logic inside of a new thread
        if self.session_handle.is_some() {
            self.session_handle.as_ref().unwrap().abort();
        };
        let handle = tokio::spawn(async move {
            loop {
                sleep(Duration::from_secs(1)).await;

                let mut session = session.clone().lock_owned().await;
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

                let mut queue = queue.lock().await;
                // Switch session
                let auto_start_next = session.next_session(iteration.clone(), &mut queue).unwrap();
                // Determine whether to autostart the next one
                if auto_start_next {
                    session.play();
                    continue;
                };
                // Kill thread
                break;
            }
        });
        self.session_handle = Some(handle);
        Ok(())
    }
    pub async fn stop(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard().await?;
        session.stop();
        session.emit();
        Ok(())
    }
    pub async fn restart(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard().await?;
        session.stop();
        session.save();
        session.restart();
        session.emit();
        Ok(())
    }
    pub async fn skip(&mut self) -> TimerResult<()> {
        let mut session = self.get_session_guard().await?;
        let iteration = self.iteration.clone();
        let queue_guard = self.queue.clone();
        let mut queue = queue_guard.lock().await;

        session.stop();
        session.next_session(iteration, &mut *queue)?;
        Ok(())
    }
}

// Helper methods
impl Timer {
    async fn get_session_clone(&self) -> TimerResult<Arc<Mutex<TimerSession>>> {
        if let Some(session) = &self.session {
            return Ok(session.clone());
        };
        Err(TimerError::UndefinedSession)
    }
    async fn get_session_guard(&self) -> TimerResult<OwnedMutexGuard<TimerSession>> {
        let session = self.session.clone().ok_or(TimerError::UndefinedSession)?;
        let session_guard = session.lock_owned().await;
        Ok(session_guard)
    }
}

// Session related methods
impl Timer {
    pub async fn get_session(&self) -> TimerResult<TimerSession> {
        let session = self.get_session_guard().await?.clone();
        Ok(session)
    }
    pub async fn set_session_intent(&mut self, app_handle: AppHandle, intent: Intent) {
        match &mut self.session {
            Some(session) => {
                let mut session = session.lock().await;
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
    pub async fn get_queue(&self) -> Queue {
        self.queue.lock().await.get()
    }
    pub async fn add_to_queue(&mut self, session: QueueSession) {
        let mut queue = self.queue.lock().await;
        queue.add(session);
    }
    pub async fn remove_from_queue(&mut self, idx: usize) -> TimerResult<()> {
        let mut queue = self.queue.lock().await;
        queue.remove(idx)
    }
    pub async fn reorder_queue(&mut self, idx: usize, target_idx: usize) -> TimerResult<()> {
        let mut queue = self.queue.lock().await;
        queue.reorder(idx, target_idx)
    }
    pub async fn clear_queue(&mut self) {
        let mut queue = self.queue.lock().await;
        queue.clear()
    }
    pub async fn increment_queue_session_iterations(&mut self, idx: usize) -> TimerResult<()> {
        let mut queue = self.queue.lock().await;
        queue.increment_session_iterations(idx)
    }
    pub async fn decrement_queue_session_iterations(&mut self, idx: usize) -> TimerResult<()> {
        let mut queue = self.queue.lock().await;
        queue.decrement_session_iterations(idx)
    }
    pub async fn update_queue_session_duration(
        &mut self,
        idx: usize,
        duration: i64,
    ) -> TimerResult<()> {
        let mut queue = self.queue.lock().await;
        queue.update_session_duration(idx, duration)
    }
}
