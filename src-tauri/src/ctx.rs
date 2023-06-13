//! Ctx is the context object passed through any IPC calls.
//! It can be queried to get the necessary states/ipc to perform any steps of a request.

use crate::database::Database;
use crate::prelude::*;
use diesel::SqliteConnection;
use serde::Serialize;
use std::sync::{Arc, Mutex};
use surrealdb::{Datastore, Session};
use tauri::{AppHandle, Manager, Wry};

pub struct Ctx {
    database: Arc<Database>,
    app_handle: Option<AppHandle<Wry>>,
}

impl Ctx {
    pub fn from_app(app: AppHandle<Wry>) -> Result<Arc<Ctx>> {
        Ok(Arc::new(Ctx::new(app)))
    }
}

impl Ctx {
    pub fn new(app_handle: AppHandle<Wry>) -> Self {
        Ctx {
            database: (*app_handle.state::<Arc<Database>>()).clone(),
            app_handle: Some(app_handle),
        }
    }

    pub fn get_database(&self) -> Arc<Database> {
        self.database.clone()
    }

    pub fn emit_event<D: Serialize + Clone>(&self, event: &str, data: D) {
        if let Some(app_handle) = &self.app_handle {
            let _ = app_handle.emit_all(event, data);
        }
    }
}

pub trait AppContext {
    // Executes a database operation and returns the result.
    fn db<F, T>(&self, operation: F) -> T
    where
        F: FnOnce(&mut SqliteConnection) -> T;
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
}

impl Ctx {
    #[allow(dead_code)]
    pub async fn test() -> Arc<Self> {
        let ds = Datastore::new("memory").await.unwrap();
        let ses = Session::for_db("appns", "appdb");
        let database = Arc::new(Database { ds, ses });

        Arc::new(Self {
            database,
            app_handle: None,
        })
    }
}
