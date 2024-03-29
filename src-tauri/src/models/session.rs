use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::sessions;

#[derive(Queryable, Selectable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = sessions, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Session {
    pub id: i32,
    pub duration: i32,
    pub summary: Option<String>,
    #[ts(type = "number")]
    pub started_at: i64,
    #[ts(type = "number")]
    pub finished_at: i64,
    pub intent_id: i32,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = sessions, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateSession {
    pub duration: i32,
    #[ts(type = "number")]
    pub started_at: i64,
    pub intent_id: i32,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = sessions, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateSession {
    pub summary: Option<String>,
}
