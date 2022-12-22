use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{ModelDeleteResultData, Queue, QueueBmc, QueueForCreate, QueueForUpdate},
    prelude::Error,
};

#[command]
pub async fn create_queue(app: AppHandle<Wry>, data: QueueForCreate) -> Result<Queue, String> {
    match Ctx::from_app(app) {
        Ok(ctx) => match QueueBmc::create(ctx, data).await {
            Ok(queue) => Ok(queue),
            Err(err) => Err(format!("{err}")),
        },
        Err(_) => Err(Error::CtxFail.to_string()),
    }
}

#[command]
pub async fn get_queue(app: AppHandle<Wry>, id: String) -> Result<Queue, String> {
    match Ctx::from_app(app) {
        Ok(ctx) => match QueueBmc::get(ctx, &id).await {
            Ok(queue) => Ok(queue),
            Err(err) => Err(format!("{err}")),
        },
        Err(_) => Err(Error::CtxFail.to_string()),
    }
}

#[command]
pub async fn get_queues(app: AppHandle<Wry>) -> Result<Vec<Queue>, String> {
    match Ctx::from_app(app) {
        Ok(ctx) => match QueueBmc::list(ctx).await {
            Ok(queues) => Ok(queues),
            Err(err) => Err(format!("{err}")),
        },
        Err(_) => Err(Error::CtxFail.to_string()),
    }
}

#[command]
pub async fn update_queue(
    app: AppHandle<Wry>,
    id: String,
    data: QueueForUpdate,
) -> Result<Queue, String> {
    match Ctx::from_app(app) {
        Ok(ctx) => match QueueBmc::update(ctx, &id, data).await {
            Ok(queue) => Ok(queue),
            Err(err) => Err(format!("{err}")),
        },
        Err(_) => Err(Error::CtxFail.to_string()),
    }
}

#[command]
pub async fn delete_queue(
    app: AppHandle<Wry>,
    id: String,
) -> Result<ModelDeleteResultData, String> {
    match Ctx::from_app(app) {
        Ok(ctx) => match QueueBmc::delete(ctx, &id).await {
            Ok(data) => Ok(data),
            Err(err) => Err(format!("{err}")),
        },
        Err(_) => Err(Error::CtxFail.to_string()),
    }
}
