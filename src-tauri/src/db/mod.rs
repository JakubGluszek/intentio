mod bmc;
mod models;

pub use bmc::*;
use diesel::{sqlite::Sqlite, Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationError, MigrationHarness};
pub use models::*;
use std::error::Error;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub struct Db {}

impl Db {
    pub fn establish_connection() -> SqliteConnection {
        let database_url = tauri::api::path::data_dir()
            .unwrap()
            .join("intentio/intentio.db");

        let database_url = database_url.to_str().unwrap();

        SqliteConnection::establish(database_url).expect("should connect to local database")
    }

    pub fn establish_connection_in_memory() -> Result<SqliteConnection, MigrationError> {
        let mut conn = SqliteConnection::establish(":memory:")
            .expect("should establish an in memory database connection");
        Self::run_migrations(&mut conn).expect("should run a migration on in memory connection");
        Ok(conn)
    }
    fn run_migrations(
        conn: &mut impl MigrationHarness<Sqlite>,
    ) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
        conn.run_pending_migrations(MIGRATIONS)?;
        Ok(())
    }
}

diesel::sql_function!(
    fn last_insert_rowid() -> diesel::sql_types::Integer;
);
