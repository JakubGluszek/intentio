//! Event layer of the backend.

use serde::Serialize;
use ts_rs::TS;

#[derive(TS, Serialize, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct HubEvent<D: Serialize + Clone> {
    pub hub: String,
    pub topic: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<D>,
}
