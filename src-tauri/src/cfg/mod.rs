use ts_rs::TS;

mod audio;
mod behavior;
mod interface;
mod timer;

pub use audio::*;
pub use behavior::*;
pub use interface::*;
pub use timer::*;

#[derive(TS)]
#[ts(export, export_to = "../src/bindings/")]
#[allow(dead_code)]
struct Config {
    pub audio: Option<Audio>,
    pub timer: Option<Timer>,
    pub interface: Option<Interface>,
    pub behavior: Option<Behavior>,
}
