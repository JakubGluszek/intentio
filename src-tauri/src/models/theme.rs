use diesel::prelude::*;
use diesel::Queryable;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::db::schema::themes;

#[derive(Queryable, Selectable, Serialize, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = themes, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct Theme {
    pub id: i32,
    pub label: String,
    pub favorite: bool,
    pub window_hex: String,
    pub base_hex: String,
    pub text_hex: String,
    pub primary_hex: String,
}

#[derive(Insertable, Deserialize, TS, Debug, Clone)]
#[diesel(table_name = themes, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateTheme {
    pub label: String,
    pub window_hex: String,
    pub base_hex: String,
    pub text_hex: String,
    pub primary_hex: String,
}

#[derive(AsChangeset, TS, Deserialize)]
#[diesel(table_name = themes, check_for_backend(diesel::sqlite::Sqlite))]
#[ts(export, export_to = "../src/bindings/")]
pub struct UpdateTheme {
    pub label: Option<String>,
    pub favorite: Option<bool>,
    pub window_hex: Option<String>,
    pub base_hex: Option<String>,
    pub text_hex: Option<String>,
    pub primary_hex: Option<String>,
}
