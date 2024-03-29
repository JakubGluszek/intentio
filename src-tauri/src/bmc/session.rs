use diesel::prelude::*;
use diesel::SqliteConnection;
use serde::Deserialize;
use ts_rs::TS;

use crate::models::CreateSession;
use crate::models::Session;
use crate::models::UpdateSession;
use crate::prelude::Result;

use super::BaseBmc;

#[derive(TS, Deserialize)]
#[ts(export, export_to = "../src/bindings/")]
pub struct GetSessionsOptions {
    pub intent_id: Option<i32>,
    pub offset: Option<i32>,
    pub limit: Option<i32>,
}

pub struct SessionBmc {}

impl SessionBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateSession) -> Result<i32> {
        use crate::db::schema::sessions;

        diesel::insert_into(sessions::table)
            .values(data)
            .execute(conn)?;
        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateSession) -> Result<i32> {
        use crate::db::schema::sessions::dsl;

        diesel::update(dsl::sessions.find(id))
            .set(data)
            .execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Session> {
        use crate::db::schema::sessions::dsl;

        let session: Session = dsl::sessions.find(id).first(conn)?;
        Ok(session)
    }

    pub fn get_list(
        conn: &mut SqliteConnection,
        options: Option<GetSessionsOptions>,
    ) -> Result<Vec<Session>> {
        use crate::db::schema::sessions::dsl;

        let mut query = dsl::sessions.into_boxed();

        if let Some(options) = options {
            // Filter out sessions based on the `intent_id` field
            if let Some(intent_id) = options.intent_id {
                query = query.filter(dsl::intent_id.eq(intent_id));
            }

            // Apply pagination based on the `offset` and `limit` fields
            if let Some(offset) = options.offset {
                query = query.offset(offset as i64);
            }

            if let Some(limit) = options.limit {
                query = query.limit(limit as i64);
            }
        };

        let sessions: Vec<Session> = query.load(conn)?;
        Ok(sessions)
    }
}

#[cfg(test)]
mod session_bmc_tests {
    use crate::{
        bmc::{test_helpers::create_dummy_intent, IntentBmc},
        db::Db,
        models::CreateIntent,
        prelude::Error,
    };

    use super::*;

    #[test]
    fn test_create_session() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intent.
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &data).unwrap();

        let started_at = chrono::Utc::now().timestamp();
        let data = CreateSession {
            duration: 1500,
            started_at,
            intent_id,
        };
        let id = SessionBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);
    }

    #[test]
    fn test_fail_create_session_non_existent_intent_row() {
        let mut conn = Db::establish_test_connection().unwrap();

        let started_at = chrono::Utc::now().timestamp();
        let data = CreateSession {
            duration: 1500,
            started_at,
            intent_id: 1,
        };
        let result = SessionBmc::create(&mut conn, &data);

        assert!(matches!(result, Err(Error::DieselError(_))));
    }

    #[test]
    fn test_get_session() {
        let mut conn = Db::establish_test_connection().unwrap();

        // create related intent
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &data).unwrap();

        let started_at = chrono::Utc::now().timestamp();
        let data = CreateSession {
            duration: 1500,
            started_at,
            intent_id,
        };
        let id = SessionBmc::create(&mut conn, &data).unwrap();
        let session = SessionBmc::get(&mut conn, id).unwrap();

        assert_eq!(session.id, 1);
        assert_eq!(session.started_at, started_at);
        assert_eq!(session.duration, 1500);
        assert_eq!(session.summary, None);
        assert_eq!(session.intent_id, intent_id);
    }

    #[test]
    fn test_get_list_of_sessions_without_options() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intent.
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &data).unwrap();

        for _ in 0..10 {
            let started_at = chrono::Utc::now().timestamp();
            let data = CreateSession {
                duration: 1500,
                started_at,
                intent_id,
            };
            SessionBmc::create(&mut conn, &data).unwrap();
        }
        let sessions = SessionBmc::get_list(&mut conn, None).unwrap();

        assert_eq!(sessions.len(), 10);
    }

    #[test]
    fn test_get_list_of_sessions_by_intent_id() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intent.
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &data).unwrap();
        let intent_id2 = IntentBmc::create(&mut conn, &data).unwrap();

        for _ in 0..5 {
            let started_at = chrono::Utc::now().timestamp();
            let data = CreateSession {
                duration: 1500,
                started_at,
                intent_id,
            };
            SessionBmc::create(&mut conn, &data).unwrap();
        }
        for _ in 0..5 {
            let started_at = chrono::Utc::now().timestamp();
            let data = CreateSession {
                duration: 1500,
                started_at,
                intent_id: intent_id2,
            };
            SessionBmc::create(&mut conn, &data).unwrap();
        }

        let options = GetSessionsOptions {
            intent_id: Some(intent_id),
            offset: None,
            limit: None,
        };
        let sessions = SessionBmc::get_list(&mut conn, Some(options)).unwrap();

        assert_eq!(sessions.len(), 5);
    }

    #[test]
    fn test_get_list_of_sessions_with_offset_and_limit() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intent.
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        let intent_id = IntentBmc::create(&mut conn, &data).unwrap();

        for _ in 0..10 {
            let started_at = chrono::Utc::now().timestamp();
            let data = CreateSession {
                duration: 1500,
                started_at,
                intent_id,
            };
            SessionBmc::create(&mut conn, &data).unwrap();
        }

        let options = GetSessionsOptions {
            intent_id: Some(intent_id),
            offset: Some(4),
            limit: Some(4),
        };
        let sessions = SessionBmc::get_list(&mut conn, Some(options)).unwrap();

        assert_eq!(sessions.len(), 4);
        assert_eq!(sessions[0].id, 5);
    }

    #[test]
    fn test_update_session_summary() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create session.
        let data = CreateSession {
            duration: 1500,
            started_at: 0,
            intent_id,
        };
        let session_id = SessionBmc::create(&mut conn, &data).unwrap();
        // Update session
        let data = UpdateSession {
            summary: Some("foo".to_string()),
        };
        SessionBmc::update(&mut conn, session_id, &data).unwrap();
        // Query and test update
        let session = SessionBmc::get(&mut conn, session_id).unwrap();
        assert_eq!(session.summary.unwrap(), "foo".to_string());
    }
}
