//! Tauri IPC commands to bridge the Project Backend Model Controller with Client side.

use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{ModelDeleteResultData, Project, ProjectBmc, ProjectForCreate},
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
        Ok(ctx) => {
            let projects = ProjectBmc::list(ctx.get_store()).await;

            projects.into()
        }
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
pub async fn delete_project(app: AppHandle<Wry>, id: String) -> IpcResponse<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => ProjectBmc::delete(ctx, &id).await.into(),
        Err(_) => Err(Error::CtxFail).into(),
    }
}
