use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::schema::scripts;

#[derive(Queryable, Selectable, Serialize, TS, Debug, Clone)]
#[diesel(table_name = scripts, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Script {
    pub id: i32,
    pub label: String,
    pub body: String,
    pub enabled: bool,
    pub exec_on_session_start: bool,
    pub exec_on_session_pause: bool,
    pub exec_on_session_complete: bool,
    pub exec_on_break_start: bool,
    pub exec_on_break_pause: bool,
    pub exec_on_break_complete: bool,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = scripts, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateScript {
    pub label: String,
    pub body: String,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = scripts, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateScript {
    pub label: Option<String>,
    pub body: Option<String>,
    pub enabled: Option<bool>,
    pub exec_on_session_start: Option<bool>,
    pub exec_on_session_pause: Option<bool>,
    pub exec_on_session_complete: Option<bool>,
    pub exec_on_break_start: Option<bool>,
    pub exec_on_break_pause: Option<bool>,
    pub exec_on_break_complete: Option<bool>,
}
