use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::models::CreateScript;
use crate::models::Script;
use crate::models::UpdateScript;
use crate::prelude::Result;

use super::BaseBmc;

pub struct ScriptBmc {}

impl ScriptBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateScript) -> Result<i32> {
        use crate::db::schema::scripts;

        diesel::insert_into(scripts::table)
            .values(data)
            .execute(conn)?;
        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateScript) -> Result<i32> {
        use crate::db::schema::scripts::dsl::scripts;

        diesel::update(scripts.find(id)).set(data).execute(conn)?;
        Ok(id)
    }

    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::scripts::dsl::scripts;

        diesel::delete(scripts.find(id)).execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Script> {
        use crate::db::schema::scripts::dsl::scripts;

        let script = scripts.find(id).first(conn)?;
        Ok(script)
    }

    pub fn get_list(conn: &mut SqliteConnection) -> Result<Vec<Script>> {
        use crate::db::schema::scripts::dsl;

        let scripts = dsl::scripts.load(conn)?;
        Ok(scripts)
    }
}

#[cfg(test)]
mod script_bmc_tests {
    use diesel::result::Error::NotFound;

    use crate::{db::Db, prelude::Error};

    use super::*;

    #[test]
    fn create_script_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create script.
        let data = CreateScript {
            label: "league_of_legends_99$_script.sh".to_string(),
            body: "You got scammed! LOL".to_string(),
        };
        let id = ScriptBmc::create(&mut conn, &data).unwrap();
        assert_eq!(id, 1);
    }

    #[test]
    fn update_script_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create script.
        let data = CreateScript {
            label: "play_spotify_track.sh".to_string(),
            body: "elaborate bash code here".to_string(),
        };
        let id = ScriptBmc::create(&mut conn, &data).unwrap();
        // Update script.
        let data = UpdateScript {
            label: None,
            body: None,
            enabled: Some(true),
            exec_on_session_start: None,
            exec_on_session_pause: None,
            exec_on_session_complete: None,
            exec_on_break_start: None,
            exec_on_break_pause: None,
            exec_on_break_complete: None,
        };
        let id = ScriptBmc::update(&mut conn, id, &data).unwrap();
        // Query script to check results.
        let script = ScriptBmc::get(&mut conn, id).unwrap();

        assert_eq!(script.enabled, true);
        assert_eq!(script.label, "play_spotify_track.sh".to_string());
        assert_eq!(script.body, "elaborate bash code here".to_string());
        assert_eq!(script.exec_on_session_start, false);
        assert_eq!(script.exec_on_session_pause, false);
        assert_eq!(script.exec_on_session_complete, false);
        assert_eq!(script.exec_on_break_start, false);
        assert_eq!(script.exec_on_break_pause, false);
        assert_eq!(script.exec_on_break_complete, false);
    }

    #[test]
    fn delete_script_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create dummy script.
        let data = CreateScript {
            label: "dummy.sh".to_string(),
            body: "<bash code here>".to_string(),
        };
        let id = ScriptBmc::create(&mut conn, &data).unwrap();
        // Delete script.
        let id = ScriptBmc::delete(&mut conn, id).unwrap();
        // Query non existent script.
        let result = ScriptBmc::get(&mut conn, id);
        // Test whether result is a NotFound error.
        assert!(matches!(result, Err(Error::DieselError(NotFound))));
    }

    #[test]
    fn get_script_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create dummy script.
        let data = CreateScript {
            label: "dummy.sh".to_string(),
            body: "<bash code here>".to_string(),
        };
        let id = ScriptBmc::create(&mut conn, &data).unwrap();
        // Query the script.
        let script = ScriptBmc::get(&mut conn, id).unwrap();
        // Test it's values.
        assert_eq!(script.id, 1);
        assert_eq!(script.enabled, false);
        assert_eq!(script.label, "dummy.sh".to_string());
        assert_eq!(script.body, "<bash code here>".to_string());
        assert_eq!(script.exec_on_session_start, false);
        assert_eq!(script.exec_on_session_pause, false);
        assert_eq!(script.exec_on_session_complete, false);
        assert_eq!(script.exec_on_break_start, false);
        assert_eq!(script.exec_on_break_pause, false);
        assert_eq!(script.exec_on_break_complete, false);
    }

    #[test]
    fn get_list_of_scripts_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create 10 dummy scripts.
        for _ in 0..10 {
            let data = CreateScript {
                label: "dummy.sh".to_string(),
                body: "<bash code here>".to_string(),
            };
            ScriptBmc::create(&mut conn, &data).unwrap();
        }
        // Query all scripts.
        let scripts = ScriptBmc::get_list(&mut conn).unwrap();
        // Test whether there's 10 of them.
        assert_eq!(scripts.len(), 10);
    }
}
