use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::tags;

#[derive(Queryable, Selectable, Serialize, Deserialize, TS, Debug, Clone, PartialEq)]
#[diesel(table_name = tags, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Tag {
    pub id: i32,
    pub label: String,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = tags, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateTag {
    pub label: String,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = tags, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateTag {
    pub label: Option<String>,
}
