use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::{intent_tags, intents};

#[derive(Queryable, Selectable, Serialize, Deserialize, TS, Debug, Clone)]
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

// Struct for many-to-many relationship
#[derive(Queryable, Identifiable)]
#[diesel(table_name = intent_tags, check_for_backend(diesel::sqlite::Sqlite))]
pub struct IntentTag {
    pub id: i32,
    pub intent_id: i32,
    pub tag_id: i32,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = intent_tags, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateIntentTag {
    pub intent_id: i32,
    pub tag_id: i32,
}
