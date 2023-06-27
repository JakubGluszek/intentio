use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::models::CreateIntent;
use crate::models::Intent;
use crate::models::Tag;
use crate::models::UpdateIntent;
use crate::prelude::Result;

use super::BaseBmc;

pub struct IntentBmc {}

impl IntentBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateIntent) -> Result<i32> {
        use crate::db::schema::intents;

        diesel::insert_into(intents::table)
            .values(data)
            .execute(conn)?;

        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateIntent) -> Result<i32> {
        use crate::db::schema::intents::dsl::intents;

        diesel::update(intents.find(id)).set(data).execute(conn)?;
        Ok(id)
    }

    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::intents::dsl;

        diesel::delete(dsl::intents.filter(dsl::id.eq(id))).execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Intent> {
        use crate::db::schema::intents::dsl;

        let intent = dsl::intents.find(id).first(conn)?;
        Ok(intent)
    }

    pub fn get_list(conn: &mut SqliteConnection) -> Result<Vec<Intent>> {
        use crate::db::schema::intents::dsl;

        let intents: Vec<Intent> = dsl::intents.load(conn)?;
        Ok(intents)
    }

    pub fn archive(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::intents::dsl::{archived_at, intents};

        let now = chrono::Utc::now().timestamp();
        diesel::update(intents.find(id))
            .set(archived_at.eq(now))
            .execute(conn)?;
        Ok(id)
    }

    pub fn unarchive(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::intents::dsl::{archived_at, intents};

        diesel::update(intents.find(id))
            .set(archived_at.eq::<Option<i64>>(None))
            .execute(conn)?;
        Ok(id)
    }

    pub fn get_tags(conn: &mut SqliteConnection, intent_id: i32) -> Result<Vec<Tag>> {
        use crate::db::schema::intent_tags::dsl as intent_tags_dsl;
        use crate::db::schema::tags::dsl as tags_dsl;

        let tags = intent_tags_dsl::intent_tags
            .filter(intent_tags_dsl::intent_id.eq(intent_id))
            .inner_join(tags_dsl::tags)
            .select(tags_dsl::tags::all_columns())
            .load::<Tag>(conn)?;

        Ok(tags)
    }
}

#[cfg(test)]
mod intent_bmc_tests {
    use crate::{
        bmc::{IntentTagBmc, TagBmc},
        db::Db,
        models::{CreateIntentTag, CreateTag},
        prelude::Error,
    };

    use super::*;

    #[test]
    fn test_create_intent() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);
    }

    #[test]
    fn test_update_intent() {
        let mut conn = Db::establish_test_connection().unwrap();

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
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let id = IntentBmc::create(&mut conn, &data).unwrap();
        let intent = IntentBmc::get(&mut conn, id).unwrap();

        assert_eq!(intent.id, 1);
        assert_eq!(&intent.label, "foo");
        assert_eq!(intent.pinned, false);
        assert_eq!(intent.archived_at, None);
    }

    #[test]
    fn test_get_list_of_intents() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateIntent {
            label: "foo".to_string(),
        };
        for _ in 0..10 {
            IntentBmc::create(&mut conn, &data).unwrap();
        }
        let intents = IntentBmc::get_list(&mut conn).unwrap();

        assert_eq!(intents.len(), 10);
    }

    #[test]
    fn test_delete_intent() {
        let mut conn = Db::establish_test_connection().unwrap();

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
        let mut conn = Db::establish_test_connection().unwrap();

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
        let mut conn = Db::establish_test_connection().unwrap();

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

    #[test]
    fn test_get_tags_for_intent() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create an intent
        let intent_data = CreateIntent {
            label: "test intent".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &intent_data).unwrap();

        // Create some tags
        let tag_data = vec![
            CreateTag {
                label: "tag1".to_string(),
            },
            CreateTag {
                label: "tag2".to_string(),
            },
            CreateTag {
                label: "tag3".to_string(),
            },
        ];
        let tag_ids: Vec<i32> = tag_data
            .iter()
            .map(|data| TagBmc::create(&mut conn, data).unwrap())
            .collect();

        // Associate the tags with the intent
        let intent_tag_data = vec![
            CreateIntentTag {
                intent_id,
                tag_id: tag_ids[0],
            },
            CreateIntentTag {
                intent_id,
                tag_id: tag_ids[1],
            },
        ];
        intent_tag_data.iter().for_each(|data| {
            IntentTagBmc::create(&mut conn, data).unwrap();
        });

        // Get the tags for the intent
        let tags = IntentBmc::get_tags(&mut conn, intent_id).unwrap();

        // Check that the correct tags were returned
        let expected_tags = vec![
            Tag {
                id: tag_ids[0],
                label: "tag1".to_string(),
            },
            Tag {
                id: tag_ids[1],
                label: "tag2".to_string(),
            },
        ];
        assert_eq!(tags, expected_tags);
    }
}
