//! Tauri IPC commands to bridge the Task Backend Model Controller with client side.

use tauri::{command, AppHandle, Manager};

use crate::{
    bmc::{GetTasksOptions, TaskBmc},
    ctx::AppContext,
    models::{CreateTask, Task, UpdateTask},
    prelude::Result,
};

use super::EventPayload;

#[command]
pub async fn create_task(app_handle: AppHandle, data: CreateTask) -> Result<i32> {
    let id = app_handle.db(|mut db| TaskBmc::create(&mut db, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("task_created", payload)?;
    Ok(id)
}

#[command]
pub async fn update_task(app_handle: AppHandle, id: i32, data: UpdateTask) -> Result<i32> {
    let id = app_handle.db(|mut db| TaskBmc::update(&mut db, id, &data))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("task_updated", payload)?;
    Ok(id)
}

#[command]
pub async fn delete_task(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| TaskBmc::delete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("task_deleted", payload)?;
    Ok(id)
}

#[command]
pub async fn get_task(app_handle: AppHandle, id: i32) -> Result<Task> {
    app_handle.db(|mut db| TaskBmc::get(&mut db, id))
}

#[command]
pub async fn get_tasks(
    app_handle: AppHandle,
    options: Option<GetTasksOptions>,
) -> Result<Vec<Task>> {
    app_handle.db(|mut db| TaskBmc::get_list(&mut db, options))
}

#[command]
pub async fn complete_task(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| TaskBmc::complete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("task_completed", payload)?;
    Ok(id)
}

#[command]
pub async fn uncomplete_task(app_handle: AppHandle, id: i32) -> Result<i32> {
    let id = app_handle.db(|mut db| TaskBmc::uncomplete(&mut db, id))?;
    let payload = EventPayload { data: id };
    app_handle.emit_all("task_uncompleted", payload)?;
    Ok(id)
}
