use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result},
    store::{Creatable, Patchable, Store},
    utils::{map, XTake, XTakeVal},
};

use super::{fire_model_event, ModelDeleteResultData};

#[derive(Serialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Todo {
    id: String,
    body: String,
    checked: bool,
    parent_id: Option<String>,
    project_id: Option<String>,
}

impl TryFrom<Object> for Todo {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Self> {
        let todo = Self {
            id: val.x_take_val("id")?,
            body: val.x_take_val("body")?,
            checked: val.x_take_val("checked")?,
            parent_id: val.x_take("parent_id")?,
            project_id: val.x_take("project_id")?,
        };

        Ok(todo)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TodoForCreate {
    body: String,
    project_id: Option<String>,
    parent_id: Option<String>,
}

impl From<TodoForCreate> for Value {
    fn from(val: TodoForCreate) -> Self {
        let data = map![
            "body".into() => val.body.into(),
            "project_id".into() => val.project_id.into(),
            "parent_id".into() => val.parent_id.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for TodoForCreate {}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct TodoForUpdate {
    body: Option<String>,
    project_id: Option<String>,
    parent_id: Option<String>,
}

impl From<TodoForUpdate> for Value {
    fn from(val: TodoForUpdate) -> Self {
        let mut data = BTreeMap::new();

        if let Some(body) = val.body {
            data.insert("body".into(), body.into());
        }
        if let Some(project_id) = val.project_id {
            data.insert("project_id".into(), project_id.into());
        }
        if let Some(parent_id) = val.parent_id {
            data.insert("parent_id".into(), parent_id.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for TodoForUpdate {}

pub struct TodoBmc {}

impl TodoBmc {
    const ENTITY: &'static str = "todo";

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Todo> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: TodoForCreate) -> Result<Todo> {
        let result = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "create", result.clone());

        result.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: TodoForUpdate) -> Result<Todo> {
        let result = ctx.get_store().exec_merge(id, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "update", result.clone());

        result.try_into()
    }

    /// Delete todo by given id and all it's todo descendants.
    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let store = ctx.get_store();

        let id = store.exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id.clone());

        fire_model_event(&ctx, Self::ENTITY, "delete", result.clone());

        let all_todos = Self::list(ctx.get_store()).await?;
        let mut children = vec![];
        let mut descendants = vec![];

        Self::get_descendants(Some(id), all_todos, &mut children, &mut descendants);

        if descendants.len() > 0 {
            Self::delete_multi(store.clone(), descendants).await?;
        }

        Ok(result)
    }

    async fn delete_multi(store: Arc<Store>, todos: Vec<Todo>) -> Result<()> {
        let mut sql = String::from("");

        for todo in todos {
            sql.push_str(&format!("DELETE {};", todo.id));
        }

        store.ds.execute(&sql, &store.ses, None, false).await?;

        Ok(())
    }

    fn get_descendants<'a>(
        target_id: Option<String>,
        mut all_todos: Vec<Todo>,
        children: &'a mut Vec<Todo>,
        descendants: &'a mut Vec<Todo>,
    ) -> &'a mut Vec<Todo> {
        // find target's direct children
        if let Some(id) = target_id {
            let mut idx = 0 as usize;
            while idx < all_todos.len() {
                if let Some(parent_id) = &all_todos[idx].parent_id {
                    if parent_id == &id {
                        let todo = all_todos.remove(idx);
                        idx = idx - 1;
                        children.push(todo);
                    }
                }
                idx = idx + 1;
            }
            return Self::get_descendants(None, all_todos, children, descendants);
        }
        // look for next descendants
        if children.len() > 0 {
            let mut idx = 0 as usize;
            while idx < children.len() {
                let mut idx2 = 0 as usize;
                while idx2 < all_todos.len() {
                    if let Some(parent_id) = &all_todos[idx2].parent_id {
                        if parent_id == &children[idx].id {
                            let todo = all_todos.remove(idx2);
                            children.push(todo);
                        }
                    }
                    idx2 = idx2 + 1;
                }

                let child = children.remove(idx);
                descendants.push(child);

                idx = idx + 1;
            }
            return Self::get_descendants(None, all_todos, children, descendants);
        }

        descendants
    }

    pub async fn list(store: Arc<Store>) -> Result<Vec<Todo>> {
        let objects = store.exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }

    /// Deletes each todo where todo.project_id = project_id
    pub async fn delete_by_project(store: Arc<Store>, project_id: &str) -> Result<()> {
        let sql = "DELETE theme WHERE project_id = $pi";
        let vars = map!["pi".into() => project_id.into()];

        store.ds.execute(sql, &store.ses, Some(vars), false).await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::get_test_store;

    use super::*;

    #[tokio::test]
    async fn cascade_delete() -> Result<()> {
        let store = get_test_store().await?;

        let sql = "
            CREATE todo:0 SET parent_id = None, body = '', checked = false, project_id = None;
            CREATE todo:1 SET parent_id = todo:0, body = '', checked = false, project_id = None;
            CREATE todo:2 SET parent_id = todo:0, body = '', checked = false, project_id = None;
            CREATE todo:3 SET parent_id = todo:1, body = '', checked = false, project_id = None;
            CREATE todo:4 SET parent_id = todo:3, body = '', checked = false, project_id = None;
        ";

        store.ds.execute(sql, &store.ses, None, false).await?;

        let all_todos = TodoBmc::list(store.clone()).await?;
        let target_id = "todo:0".to_string();

        let mut children = vec![];
        let mut descendants = vec![];

        TodoBmc::get_descendants(Some(target_id), all_todos, &mut children, &mut descendants);

        assert_eq!(descendants.len(), 4);

        TodoBmc::delete_multi(store.clone(), descendants).await?;

        let todos = TodoBmc::list(store).await?;

        assert_eq!(todos.len(), 1);

        Ok(())
    }
}
