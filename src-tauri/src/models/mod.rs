// Backend models controllers for the application.

use serde::Serialize;
use ts_rs::TS;

mod intent;
mod note;
mod script;
mod session;
mod settings;
mod task;
mod theme;

// Re-Exports
pub use intent::*;
pub use note::*;
pub use script::*;
pub use session::*;
pub use settings::*;
pub use task::*;
pub use theme::*;

/// Delete mutation queries will return an {id} struct.
#[derive(TS, Serialize, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ModelDeleteResultData {
    pub id: String,
}

impl From<String> for ModelDeleteResultData {
    fn from(id: String) -> Self {
        Self { id }
    }
}
