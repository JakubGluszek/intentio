use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Queryable, Selectable, Serialize, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = crate::schema::intents, check_for_backend(diesel::sqlite::Sqlite))]
// #[ts(export, export_to = "../src/bindings/")]
pub struct Intent {
    pub id: i32,
    pub label: String,
    pub pinned: bool,
    pub created_at: NaiveDateTime,
    pub archived_at: Option<NaiveDateTime>,
}

#[derive(Insertable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = crate::schema::intents, check_for_backend(diesel::sqlite::Sqlite))]
// #[ts(export, export_to = "../src/bindings/")]
pub struct CreateIntent {
    pub label: String,
}

#[derive(AsChangeset)]
#[diesel(table_name = crate::schema::intents, check_for_backend(diesel::sqlite::Sqlite))]
pub struct UpdateIntent {
    pub label: Option<String>,
    pub pinned: Option<bool>,
}
