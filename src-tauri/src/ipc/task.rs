//! Tauri IPC commands to bridge the Task Backend Model Controller with client side.

use tauri::{command, AppHandle};

use crate::{
    bmc::{GetTasksOptions, TaskBmc},
    ctx::AppContext,
    models::{CreateTask, Task, UpdateTask},
    prelude::Result,
};

#[command]
pub async fn create_task(app_handle: AppHandle, data: CreateTask) -> Result<i32> {
    app_handle.db(|mut db| TaskBmc::create(&mut db, &data))
}

#[command]
pub async fn update_task(app_handle: AppHandle, id: i32, data: UpdateTask) -> Result<i32> {
    app_handle.db(|mut db| TaskBmc::update(&mut db, id, &data))
}

#[command]
pub async fn delete_task(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| TaskBmc::delete(&mut db, id))
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
    app_handle.db(|mut db| TaskBmc::complete(&mut db, id))
}

#[command]
pub async fn uncomplete_task(app_handle: AppHandle, id: i32) -> Result<i32> {
    app_handle.db(|mut db| TaskBmc::uncomplete(&mut db, id))
}
