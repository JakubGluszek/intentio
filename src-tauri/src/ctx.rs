//! Ctx is the context object passed through any IPC calls.
//! It can be queried to get the necessary states/services to perform any steps of a request.

use crate::prelude::*;
use crate::store::Store;
use serde::Serialize;
use std::sync::Arc;
use surrealdb::{Datastore, Session};
use tauri::{AppHandle, Manager, Wry};

pub struct Ctx {
    store: Arc<Store>,
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
            store: (*app_handle.state::<Arc<Store>>()).clone(),
            app_handle: Some(app_handle),
        }
    }

    #[allow(dead_code)]
    pub async fn test() -> Arc<Self> {
        let ds = Datastore::new("memory").await.unwrap();
        let ses = Session::for_db("appns", "appdb");
        let store = Arc::new(Store { ds, ses });

        Arc::new(Self {
            store,
            app_handle: None,
        })
    }

    pub fn get_store(&self) -> Arc<Store> {
        self.store.clone()
    }

    pub fn emit_event<D: Serialize + Clone>(&self, event: &str, data: D) {
        if let Some(app_handle) = &self.app_handle {
            let _ = app_handle.emit_all(event, data);
        }
    }
}
