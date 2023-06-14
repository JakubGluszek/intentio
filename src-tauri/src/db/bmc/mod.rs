mod intent;
mod session;
mod task;

pub use intent::*;
pub use session::*;
pub use task::*;

use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::prelude::Result;

pub struct BaseBmc {}

impl BaseBmc {
    fn get_last_insert_id(conn: &mut SqliteConnection) -> Result<i32> {
        let id: i32 = diesel::select(last_insert_rowid()).first(conn)?;
        Ok(id)
    }
}

diesel::sql_function!(
    fn last_insert_rowid() -> diesel::sql_types::Integer;
);
