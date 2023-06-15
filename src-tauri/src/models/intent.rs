use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::intents;

#[derive(Queryable, Selectable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = intents, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Intent {
    pub id: i32,
    pub label: String,
    pub pinned: bool,
    #[ts(type = "number")]
    pub created_at: i64,
    #[ts(type = "number")]
    pub archived_at: Option<i64>,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = intents, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateIntent {
    pub label: String,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = intents, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateIntent {
    pub label: Option<String>,
    pub pinned: Option<bool>,
}
