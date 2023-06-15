mod config;
mod intent;
mod script;
mod session;
mod state;
mod task;
mod theme;
mod timer;
mod utils;

pub use config::*;
pub use intent::*;
pub use script::*;
pub use session::*;
pub use state::*;
pub use task::*;
pub use theme::*;
pub use timer::*;
pub use utils::*;

use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, Clone, TS)]
#[ts(export, export_to = "../src/bindings/")]
pub struct EventPayload<T> {
    data: T,
}
