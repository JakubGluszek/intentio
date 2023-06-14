use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::tasks;

#[derive(Queryable, Selectable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = tasks, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Task {
    pub id: i32,
    pub body: String,
    pub completed: bool,
    #[ts(type = "Date")]
    pub created_at: NaiveDateTime,
    #[ts(type = "Date")]
    pub finished_at: Option<NaiveDateTime>,
    pub intent_id: i32,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = tasks, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateTask {
    pub body: String,
    pub intent_id: i32,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = tasks, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateTask {
    pub body: Option<String>,
}
