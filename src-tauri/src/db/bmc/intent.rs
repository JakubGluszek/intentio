use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::db::UpdateIntent;
use crate::db::{CreateIntent, Intent};
use crate::prelude::Result;

use super::BaseBmc;

pub struct IntentBmc {}

impl IntentBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateIntent) -> Result<i32> {
        use crate::schema::intents;

        diesel::insert_into(intents::table)
            .values(data)
            .execute(conn)?;

        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateIntent) -> Result<i32> {
        use crate::schema::intents::dsl::intents;

        diesel::update(intents.find(id)).set(data).execute(conn)?;
        Ok(id)
    }

    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::schema::intents::dsl;

        diesel::delete(dsl::intents.filter(dsl::id.eq(id))).execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Intent> {
        use crate::schema::intents::dsl;

        let intent = dsl::intents.find(id).first(conn)?;
        Ok(intent)
    }

    pub fn get_all(conn: &mut SqliteConnection) -> Result<Vec<Intent>> {
        use crate::schema::intents::dsl;

        let intents: Vec<Intent> = dsl::intents.load(conn)?;
        Ok(intents)
    }

    pub fn archive(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::schema::intents::dsl::{archived_at, intents};

        let now = chrono::Utc::now().naive_utc();
        diesel::update(intents.find(id))
            .set(archived_at.eq(now))
            .execute(conn)?;
        Ok(id)
    }

    pub fn unarchive(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::schema::intents::dsl::{archived_at, intents};

        diesel::update(intents.find(id))
            .set(archived_at.eq::<Option<chrono::NaiveDateTime>>(None))
            .execute(conn)?;
        Ok(id)
    }
}

#[cfg(test)]
mod intent_bmc_tests {
    use crate::{db::Db, prelude::Error};
    use chrono::Utc;

    use super::*;

    #[test]
    fn test_create_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);
    }

    #[test]
    fn test_update_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();
        let data = UpdateIntent {
            label: Some("bar".to_string()),
            pinned: None,
        };
        let id = IntentBmc::update(&mut conn, id, &data).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_eq!(data.label.unwrap(), intent.label);
        assert_eq!(intent.pinned, false);
    }

    #[test]
    fn test_get_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_eq!(intent.id, 1);
        assert_eq!(&intent.label, "foo");
        assert_eq!(intent.pinned, false);
        assert_eq!(intent.archived_at, None);

        let created_at = intent.created_at.timestamp_micros();
        let now = Utc::now().naive_utc().timestamp_micros();

        assert!(created_at < now);
    }

    #[test]
    fn test_get_all_intents() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        for _ in 0..10 {
            IntentBmc::create(&mut conn, &data).unwrap();
        }
        let intents = IntentBmc::get_all(&mut conn).unwrap();

        assert_eq!(intents.len(), 10);
    }

    #[test]
    fn test_delete_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();

        IntentBmc::delete(&mut conn, id).unwrap();

        let result = IntentBmc::get(&mut conn, id);
        assert!(matches!(result, Err(Error::DieselError(_))));
    }

    #[test]
    fn test_archive_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();

        IntentBmc::archive(&mut conn, id).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_ne!(intent.archived_at, None);
    }

    #[test]
    fn test_unarchive_intent() {
        let mut conn = Db::establish_connection_in_memory().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();

        IntentBmc::archive(&mut conn, id).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_ne!(intent.archived_at, None);

        IntentBmc::unarchive(&mut conn, id).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_eq!(intent.archived_at, None);
    }
}
