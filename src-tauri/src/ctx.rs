use diesel::SqliteConnection;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

use crate::timer::Timer;

pub trait AppContext {
    // Executes a database operation and returns the result.
    fn db<F, T>(&self, operation: F) -> T
    where
        F: FnOnce(&mut SqliteConnection) -> T;

    fn timer<F, T>(&self, operation: F) -> T
    where
        F: FnOnce(&mut Timer) -> T;
}

impl AppContext for AppHandle {
    fn db<F, T>(&self, operation: F) -> T
    where
        F: FnOnce(&mut SqliteConnection) -> T,
    {
        // Get a reference to the database connection.
        let db_guard: tauri::State<Mutex<SqliteConnection>> = self.state();
        let mut db = db_guard.lock().unwrap();

        // Execute the database operation and return the result.
        operation(&mut *db)
    }

    fn timer<F, T>(&self, operation: F) -> T
    where
        F: FnOnce(&mut Timer) -> T,
    {
        let timer_guard: tauri::State<Mutex<Timer>> = self.state();
        let mut timer = timer_guard.lock().unwrap();
        operation(&mut *timer)
    }
}
