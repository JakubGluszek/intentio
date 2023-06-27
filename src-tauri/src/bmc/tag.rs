use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::models::CreateTag;
use crate::models::Tag;
use crate::models::UpdateTag;
use crate::prelude::Result;

use super::BaseBmc;

pub struct TagBmc {}

impl TagBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateTag) -> Result<i32> {
        use crate::db::schema::tags;

        diesel::insert_into(tags::table)
            .values(data)
            .execute(conn)?;

        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateTag) -> Result<i32> {
        use crate::db::schema::tags::dsl::tags;

        diesel::update(tags.find(id)).set(data).execute(conn)?;
        Ok(id)
    }

    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::tags::dsl;

        diesel::delete(dsl::tags.filter(dsl::id.eq(id))).execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Tag> {
        use crate::db::schema::tags::dsl;

        let tag = dsl::tags.find(id).first(conn)?;
        Ok(tag)
    }

    pub fn get_list(conn: &mut SqliteConnection) -> Result<Vec<Tag>> {
        use crate::db::schema::tags::dsl;

        let tags: Vec<Tag> = dsl::tags.load(conn)?;
        Ok(tags)
    }
}

#[cfg(test)]
mod tag_bmc_tests {
    use crate::{db::Db, prelude::Error};

    use super::*;

    #[test]
    fn test_create_tag() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateTag {
            label: "foo".to_string(),
        };
        let id = TagBmc::create(&mut conn, &data).unwrap();
        assert_eq!(id, 1);
    }

    #[test]
    fn test_update_tag() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateTag {
            label: "foo".to_string(),
        };
        let id = TagBmc::create(&mut conn, &data).unwrap();

        let update_data = UpdateTag {
            label: Some("bar".to_string()),
        };
        TagBmc::update(&mut conn, id, &update_data).unwrap();

        let tag = TagBmc::get(&mut conn, id).unwrap();
        assert_eq!(tag.label, "bar");
    }

    #[test]
    fn test_delete_tag() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateTag {
            label: "foo".to_string(),
        };
        let id = TagBmc::create(&mut conn, &data).unwrap();

        TagBmc::delete(&mut conn, id).unwrap();

        let result = TagBmc::get(&mut conn, id);
        assert!(matches!(result, Err(Error::DieselError(_))));
    }

    #[test]
    fn test_get_tag() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data = CreateTag {
            label: "foo".to_string(),
        };
        let id = TagBmc::create(&mut conn, &data).unwrap();

        let tag = TagBmc::get(&mut conn, id).unwrap();
        assert_eq!(tag.label, "foo");
    }

    #[test]
    fn test_get_tag_list() {
        let mut conn = Db::establish_test_connection().unwrap();

        let data1 = CreateTag {
            label: "foo".to_string(),
        };
        let data2 = CreateTag {
            label: "bar".to_string(),
        };
        TagBmc::create(&mut conn, &data1).unwrap();
        TagBmc::create(&mut conn, &data2).unwrap();

        let tags = TagBmc::get_list(&mut conn).unwrap();
        assert_eq!(tags.len(), 2);
    }
}
