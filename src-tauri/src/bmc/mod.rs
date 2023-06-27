mod intent;
mod intent_tag;
mod script;
mod session;
mod tag;
mod task;
mod theme;

pub use intent::*;
pub use intent_tag::*;
pub use script::*;
pub use session::*;
pub use tag::*;
pub use task::*;
pub use theme::*;

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

mod test_helpers {
    use super::{IntentBmc, TagBmc};
    use crate::models::{CreateIntent, CreateTag};
    use diesel::SqliteConnection;

    pub fn create_dummy_intent(conn: &mut SqliteConnection) -> i32 {
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        IntentBmc::create(conn, &data).unwrap()
    }

    pub fn create_dummy_tag(conn: &mut SqliteConnection) -> i32 {
        let data = CreateTag {
            label: "foo".to_string(),
        };
        TagBmc::create(conn, &data).unwrap()
    }
}
