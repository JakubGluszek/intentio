mod intent;

use diesel::prelude::*;
use diesel::SqliteConnection;
pub use intent::*;

use crate::prelude::Result;

use super::last_insert_rowid;

pub struct BaseBmc {}

impl BaseBmc {
    fn get_last_insert_id(conn: &mut SqliteConnection) -> Result<i32> {
        let id: i32 = diesel::select(last_insert_rowid()).first(conn)?;
        Ok(id)
    }
}
