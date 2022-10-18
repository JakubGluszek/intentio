use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{ModelDeleteResultData, Project, ProjectBmc, ProjectForCreate, ProjectForUpdate},
    prelude::Error,
};

use super::IpcResponse;

#[command]
pub async fn get_project(app: AppHandle<Wry>, id: String) -> IpcResponse<Project> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::get(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_projects(app: AppHandle<Wry>) -> IpcResponse<Vec<Project>> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::list(ctx).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn create_project(app: AppHandle<Wry>, data: ProjectForCreate) -> IpcResponse<Project> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::create(ctx, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
#[command]
pub async fn update_project(
    app: AppHandle<Wry>,
    id: String,
    data: ProjectForUpdate,
) -> IpcResponse<Project> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::update(ctx, &id, data).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
#[command]
pub async fn delete_project(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
