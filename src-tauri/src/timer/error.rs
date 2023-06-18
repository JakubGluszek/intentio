use ts_rs::TS;

#[derive(thiserror::Error, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub enum TimerError {
    #[error("UndefinedSession")]
    UndefinedSession,
}
