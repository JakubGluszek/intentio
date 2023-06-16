#[derive(thiserror::Error, Debug)]
pub enum TimerError {
    #[error("Timer session is not defined")]
    UndefinedSession,
}
