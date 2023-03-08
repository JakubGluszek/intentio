//! Ctx is the context object passed through any IPC calls.
//! It can be queried to get the necessary states/ipc to perform any steps of a request.

use crate::database::Database;
use crate::prelude::*;
use serde::Serialize;
use std::sync::Arc;
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

    pub fn get_database(&self) -> Arc<Database> {
        self.database.clone()
    }

    pub fn emit_event<D: Serialize + Clone>(&self, event: &str, data: D) {
        if let Some(app_handle) = &self.app_handle {
            let _ = app_handle.emit_all(event, data);
        }
    }
}
