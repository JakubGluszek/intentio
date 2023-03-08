//! Application wide utilities. Most will be re-exported.

mod x_take;

// --- re-exports
pub use self::x_take::*;

// from: https://github.com/surrealdb/surrealdb.wasm/blob/main/src/mac/mod.rs
macro_rules! map {
    ($($k:expr => $v:expr),* $(,)?) => {{
		let mut m = ::std::collections::BTreeMap::new();
        $(m.insert($k, $v);)+
        m
    }};
  }
pub(crate) use map;

pub fn get_config_path() -> String {
    let config_dir = tauri::api::path::config_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_owned();

    let config_dir = config_dir + "/intentio";
    config_dir
}
