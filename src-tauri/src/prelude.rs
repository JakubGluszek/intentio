pub use crate::error::Error;

pub const DEFAULT_ALERT_FILE: &'static str = "alert-1.ogg";

pub type Result<T> = core::result::Result<T, Error>;

pub type Minutes = i64;
