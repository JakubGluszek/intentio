use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct State {
    pub active_intent_id: Option<String>,
}

impl Default for State {
    fn default() -> Self {
        State {
            active_intent_id: None,
        }
    }
}

#[derive(Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct StateForUpdate {
    pub active_intent_id: Option<Option<String>>,
}
