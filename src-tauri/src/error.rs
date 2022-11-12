//! This is the main (and only for now) application Error type.
//! It's using 'thiserror' as it reduces boilerplate error code while providing rich error typing.

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("Fail to get Ctx")]
    CtxFail,

    #[error("Value not of type '{0}'")]
    XValueNotOfType(&'static str),

    #[error("Property '{0}' not found")]
    XPropertyNotFound(String),

    #[error("StateNotAccessed")]
    StateNotAccessed,

    #[error("Fail to create. Cause: {0}")]
    StoreFailToCreate(String),

    #[error("No current project")]
    NoCurrentProject,

    #[error(transparent)]
    Surreal(#[from] surrealdb::Error),

    #[error(transparent)]
    IO(#[from] std::io::Error),
}
