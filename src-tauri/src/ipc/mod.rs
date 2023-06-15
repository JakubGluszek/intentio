mod config;
mod intent;
mod script;
mod session;
mod state;
mod task;
mod theme;
mod utils;

pub use config::*;
pub use intent::*;
pub use script::*;
pub use session::*;
pub use state::*;
pub use task::*;
pub use theme::*;
use ts_rs::TS;
pub use utils::*;

use serde::Serialize;

#[derive(Serialize, Clone, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct EventPayload<T> {
    data: T,
}
