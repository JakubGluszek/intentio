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
    #[ts(type = "number")]
    pub created_at: i64,
    #[ts(type = "number")]
    pub finished_at: Option<i64>,
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
