use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::schema::intents;

#[derive(Queryable, Selectable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = intents, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Intent {
    pub id: i32,
    pub label: String,
    pub pinned: bool,
    #[ts(type = "Date")]
    pub created_at: NaiveDateTime,
    #[ts(type = "Date")]
    pub archived_at: Option<NaiveDateTime>,
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
