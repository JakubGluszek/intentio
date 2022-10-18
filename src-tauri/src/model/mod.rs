// Backend model controllers for the application.

use crate::ctx::Ctx;
use crate::event::HubEvent;
use serde::Serialize;
use ts_rs::TS;

mod bmc_base;
mod project;
mod settings;
mod theme;

// Re-Exports
pub use project::*;
pub use settings::*;
pub use theme::*;

fn fire_model_event<D>(ctx: &Ctx, entity: &str, action: &str, data: D)
where
    D: Serialize + Clone,
{
    ctx.emit_hub_event(HubEvent {
        hub: "Model".to_string(),
        topic: entity.to_string(),
        label: Some(action.to_string()),
        data: Some(data),
    });
}

pub type Minutes = i64;

/// Delete mutation queries will return an {id} struct.
#[derive(TS, Serialize, Clone)]
#[ts(export, export_to = "../src-ui/src/bindings/")]
pub struct ModelDeleteResultData {
    pub id: String,
}

impl From<String> for ModelDeleteResultData {
    fn from(id: String) -> Self {
        Self { id }
    }
}
