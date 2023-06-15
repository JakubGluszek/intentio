use diesel::prelude::*;
use diesel::sql_types::Timestamp;
use diesel::SqliteConnection;
use serde::Deserialize;
use ts_rs::TS;

use crate::models::{CreateTask, Task, UpdateTask};
use crate::prelude::Result;

use super::BaseBmc;

#[derive(TS, Deserialize)]
#[ts(export, export_to = "../src/bindings/")]
pub struct GetTasksOptions {
    pub intent_id: Option<i32>,
    pub offset: Option<i32>,
    pub limit: Option<i32>,
    pub completed: Option<bool>,
}

pub struct TaskBmc {}

impl TaskBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateTask) -> Result<i32> {
        use crate::db::schema::tasks;

        diesel::insert_into(tasks::table)
            .values(data)
            .execute(conn)?;
        BaseBmc::get_last_insert_id(conn)
    }

    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateTask) -> Result<i32> {
        use crate::db::schema::tasks::dsl;

        diesel::update(dsl::tasks.find(id))
            .set(data)
            .execute(conn)?;
        Ok(id)
    }

    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::tasks::dsl;

        diesel::delete(dsl::tasks.filter(dsl::id.eq(id))).execute(conn)?;
        Ok(id)
    }

    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Task> {
        use crate::db::schema::tasks::dsl;

        let task: Task = dsl::tasks.find(id).first(conn)?;
        Ok(task)
    }

    pub fn get_list(
        conn: &mut SqliteConnection,
        options: Option<GetTasksOptions>,
    ) -> Result<Vec<Task>> {
        use crate::db::schema::tasks::dsl;

        let mut query = dsl::tasks.into_boxed();

        if let Some(options) = options {
            if let Some(intent_id) = options.intent_id {
                query = query.filter(dsl::intent_id.eq(intent_id));
            }
            if let Some(completed) = options.completed {
                query = query.filter(dsl::completed.eq(completed));
            }
            if let Some(offset) = options.offset {
                query = query.offset(offset as i64);
            }
            if let Some(limit) = options.limit {
                query = query.limit(limit as i64);
            }
        }

        let tasks: Vec<Task> = query.load(conn)?;
        Ok(tasks)
    }

    pub fn complete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        let now = chrono::Utc::now().naive_utc();
        let query = "UPDATE tasks SET completed = ?, finished_at = ? WHERE id = ?";

        diesel::sql_query(query)
            .bind::<diesel::sql_types::Bool, _>(true)
            .bind::<diesel::sql_types::Nullable<Timestamp>, _>(now)
            .bind::<diesel::sql_types::Integer, _>(id)
            .execute(conn)?;
        Ok(id)
    }

    pub fn uncomplete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        let query = "UPDATE tasks SET completed = ?, finished_at = ? WHERE id = ?";

        diesel::sql_query(query)
            .bind::<diesel::sql_types::Bool, _>(false)
            .bind::<diesel::sql_types::Nullable<Timestamp>, Option<chrono::NaiveDateTime>>(None)
            .bind::<diesel::sql_types::Integer, _>(id)
            .execute(conn)?;
        Ok(id)
    }
}

#[cfg(test)]
mod task_bmc_tests {
    use crate::{bmc::IntentBmc, db::Db, models::CreateIntent, prelude::Error};

    use super::*;

    fn create_dummy_intent(conn: &mut SqliteConnection) -> i32 {
        let data = CreateIntent {
            label: "foo".to_string(),
        };
        IntentBmc::create(conn, &data).unwrap()
    }

    #[test]
    fn test_create_task() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create task.
        let data = CreateTask {
            body: "supercalifragilisticexpialidocious".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        // Query task.
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test it's values.
        assert_eq!(task.id, 1);
        assert_eq!(task.completed, false);
        assert_eq!(task.body, "supercalifragilisticexpialidocious".to_string());
        assert_eq!(task.intent_id, intent_id);
        assert!(task.finished_at.is_none());
    }

    #[test]
    fn test_update_task_body() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create task.
        let data = CreateTask {
            body: "supercalifragilisticexpialidocious".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        // Update task.
        let data = UpdateTask {
            body: Some("goofball".to_string()),
        };
        let id = TaskBmc::update(&mut conn, id, &data).unwrap();
        // Query task.
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test it's values.
        assert_eq!(task.body, "goofball".to_string());
    }

    #[test]
    fn test_delete_task() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create task.
        let data = CreateTask {
            body: "supercalifragilisticexpialidocious".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        assert_eq!(id, 1);
        // Delete task.
        let id = TaskBmc::delete(&mut conn, id).unwrap();
        // Query non existent task.
        let result = TaskBmc::get(&mut conn, id);
        // Test the result.
        assert!(matches!(result, Err(Error::DieselError(_))));
    }

    #[test]
    fn test_get_task() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create task.
        let data = CreateTask {
            body: "supercalifragilisticexpialidocious".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test task values.
        assert_eq!(task.id, 1);
        assert_eq!(task.body, "supercalifragilisticexpialidocious".to_string());
        assert_eq!(task.completed, false);
        assert!(task.finished_at.is_none());
    }

    #[test]
    fn test_get_list_of_tasks_without_options() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create 10 tasks.
        for _ in 0..10 {
            let data = CreateTask {
                body: "supercalifragilisticexpialidocious".to_string(),
                intent_id,
            };
            TaskBmc::create(&mut conn, &data).unwrap();
        }
        let tasks = TaskBmc::get_list(&mut conn, None).unwrap();
        // Test length.
        assert_eq!(tasks.len(), 10);
    }

    #[test]
    fn test_get_list_of_tasks_by_intent_id() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intents.
        let intent_id = create_dummy_intent(&mut conn);
        let intent_id2 = create_dummy_intent(&mut conn);

        for _ in 0..5 {
            let data = CreateTask {
                body: "wadduh cuh".to_string(),
                intent_id,
            };
            TaskBmc::create(&mut conn, &data).unwrap();
        }
        for _ in 0..5 {
            let data = CreateTask {
                body: "wadduh blood".to_string(),
                intent_id: intent_id2,
            };
            TaskBmc::create(&mut conn, &data).unwrap();
        }

        let options = GetTasksOptions {
            intent_id: Some(intent_id),
            offset: None,
            limit: None,
            completed: None,
        };
        let sessions = TaskBmc::get_list(&mut conn, Some(options)).unwrap();

        assert_eq!(sessions.len(), 5);
    }

    #[test]
    fn test_get_list_of_tasks_with_offset_and_limit() {
        let mut conn = Db::establish_test_connection().unwrap();

        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);

        for _ in 0..10 {
            let data = CreateTask {
                body: "extremely difficult task".to_string(),
                intent_id,
            };
            TaskBmc::create(&mut conn, &data).unwrap();
        }

        let options = GetTasksOptions {
            intent_id: Some(intent_id),
            offset: Some(4),
            limit: Some(4),
            completed: None,
        };
        let sessions = TaskBmc::get_list(&mut conn, Some(options)).unwrap();

        assert_eq!(sessions.len(), 4);
        assert_eq!(sessions[0].id, 5);
    }

    #[test]
    fn test_get_total_list_of_completed_tasks_only() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create 10 tasks.
        for i in 0..10 {
            let data = CreateTask {
                body: "extremely difficult task".to_string(),
                intent_id,
            };
            let id = TaskBmc::create(&mut conn, &data).unwrap();
            // Complete every other task.
            if i % 2 == 0 {
                TaskBmc::complete(&mut conn, id).unwrap();
            }
        }

        let options = GetTasksOptions {
            intent_id: None,
            completed: Some(true),
            offset: None,
            limit: None,
        };
        let sessions = TaskBmc::get_list(&mut conn, Some(options)).unwrap();

        assert_eq!(sessions.len(), 5);
        for session in sessions {
            assert!(session.completed);
        }
    }

    #[test]
    fn test_complete_task() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create a task.
        let data = CreateTask {
            body: "to be completed".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        // Complete the task.
        let id = TaskBmc::complete(&mut conn, id).unwrap();
        // Query the task.
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test if it's actually completed.
        assert_eq!(task.completed, true);
        assert!(task.finished_at.is_some());
    }

    #[test]
    fn test_uncomplete_task() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create related intent.
        let intent_id = create_dummy_intent(&mut conn);
        // Create a task.
        let data = CreateTask {
            body: "to be completed".to_string(),
            intent_id,
        };
        let id = TaskBmc::create(&mut conn, &data).unwrap();
        // Complete the task.
        let id = TaskBmc::complete(&mut conn, id).unwrap();
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test if it's actually completed.
        assert_eq!(task.completed, true);
        assert!(task.finished_at.is_some());
        // Reverse completion.
        let id = TaskBmc::uncomplete(&mut conn, id).unwrap();
        let task = TaskBmc::get(&mut conn, id).unwrap();
        // Test whether completion has been reversed.
        assert_eq!(task.completed, false);
        assert!(task.finished_at.is_none());
    }
}
