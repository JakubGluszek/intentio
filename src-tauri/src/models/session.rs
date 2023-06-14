use chrono::NaiveDateTime;
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
    #[ts(type = "Date")]
    pub started_at: NaiveDateTime,
    #[ts(type = "Date")]
    pub finished_at: NaiveDateTime,
    pub intent_id: i32,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = sessions, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateSession {
    pub duration: i32,
    pub summary: Option<String>,
    pub started_at: NaiveDateTime,
    pub intent_id: i32,
}
