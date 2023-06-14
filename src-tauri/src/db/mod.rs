pub mod schema;

use diesel::{connection::SimpleConnection, sqlite::Sqlite, Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationError, MigrationHarness};
use std::{
    error::Error,
    fs,
    path::{Path, PathBuf},
};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub struct Db {}

impl Db {
    pub fn setup() -> crate::prelude::Result<SqliteConnection> {
        if !Self::verify_root_dir() {
            Self::create_root_dir()?;
        }
        let mut conn = Self::establish_connection();

        conn.batch_execute("PRAGMA foreign_keys = ON;").unwrap();

        Self::run_migrations(&mut conn).expect("should run migrations");

        Ok(conn)
    }
    pub fn establish_connection() -> SqliteConnection {
        let database_url = Self::data_path().join("intentio.db");
        let database_url = database_url.to_str().unwrap();

        SqliteConnection::establish(database_url).expect("should connect to local database")
    }

    #[allow(dead_code)]
    pub fn establish_test_connection() -> Result<SqliteConnection, MigrationError> {
        let mut conn = SqliteConnection::establish(":memory:")
            .expect("should establish an in memory database connection");
        conn.batch_execute("PRAGMA foreign_keys = ON;").unwrap();
        Self::run_migrations(&mut conn).expect("should run a migration on in memory connection");
        Ok(conn)
    }
    fn run_migrations(
        conn: &mut impl MigrationHarness<Sqlite>,
    ) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
        conn.run_pending_migrations(MIGRATIONS)?;
        Ok(())
    }

    fn create_root_dir() -> crate::prelude::Result<()> {
        fs::create_dir(&Self::data_path())?;
        Ok(())
    }

    fn verify_root_dir() -> bool {
        Path::new(&Self::data_path()).is_dir()
    }

    fn data_path() -> PathBuf {
        tauri::api::path::data_dir().unwrap().join("intentio/")
    }
}
