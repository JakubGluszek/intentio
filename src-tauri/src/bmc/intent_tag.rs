use diesel::prelude::*;
use diesel::SqliteConnection;
use ts_rs::TS;

use crate::models::CreateIntentTag;
use crate::prelude::Result;

use super::BaseBmc;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct DeleteIntentTag {
    pub intent_id: i32,
    pub tag_id: i32,
}

pub struct IntentTagBmc {}

impl IntentTagBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateIntentTag) -> Result<i32> {
        use crate::db::schema::intent_tags;

        diesel::insert_into(intent_tags::table)
            .values(data)
            .execute(conn)?;

        BaseBmc::get_last_insert_id(conn)
    }

    pub fn delete(conn: &mut SqliteConnection, data: &DeleteIntentTag) -> Result<()> {
        use crate::db::schema::intent_tags::dsl;

        diesel::delete(
            dsl::intent_tags.filter(
                dsl::intent_id
                    .eq(data.intent_id)
                    .and(dsl::tag_id.eq(data.tag_id)),
            ),
        )
        .execute(conn)?;
        Ok(())
    }
}

#[cfg(test)]
mod intent_tag_bmc_tests {
    use crate::{bmc::test_helpers, db::Db};

    use super::*;

    #[test]
    fn create_intent_tag_test() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create dummy intent
        let intent_id = test_helpers::create_dummy_intent(&mut conn);
        // Create dummy tag
        let tag_id = test_helpers::create_dummy_tag(&mut conn);

        // Create association
        let data = CreateIntentTag { intent_id, tag_id };
        let id = IntentTagBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);
    }

    #[test]
    fn delete_intent_tag_test() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create dummy intent
        let intent_id = test_helpers::create_dummy_intent(&mut conn);
        // Create dummy tag
        let tag_id = test_helpers::create_dummy_tag(&mut conn);

        // Create association
        let data = CreateIntentTag { intent_id, tag_id };
        let id = IntentTagBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);

        let data = DeleteIntentTag { intent_id, tag_id };
        // Delete intent tag
        IntentTagBmc::delete(&mut conn, &data).unwrap();
    }
}
