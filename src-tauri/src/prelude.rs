pub use crate::error::Error;

pub const DEFAULT_THEME: &'static str = "theme:abyss";
pub const DEFAULT_ALERT_FILE: &'static str = "alert-1.ogg";

pub type Result<T> = core::result::Result<T, Error>;

// Generic Wrapper tuple struct for newtype pattern, mostly for external type to type From/TryFrom conversions
pub struct W<T>(pub T);

pub use std::format as f;

pub type Minutes = i64;
