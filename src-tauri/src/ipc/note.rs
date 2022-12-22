use tauri::{command, AppHandle, Wry};

use crate::{
    ctx::Ctx,
    model::{ModelDeleteResultData, Note, NoteBmc, NoteForCreate, NoteForUpdate},
    prelude::{Error, Result},
};

#[command]
pub async fn create_note(app: AppHandle<Wry>, data: NoteForCreate) -> Result<Note> {
    match Ctx::from_app(app) {
        Ok(ctx) => match NoteBmc::create(ctx, data).await {
            Ok(note) => Ok(note),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn update_note(app: AppHandle<Wry>, id: String, data: NoteForUpdate) -> Result<Note> {
    match Ctx::from_app(app) {
        Ok(ctx) => match NoteBmc::update(ctx, &id, data).await {
            Ok(note) => Ok(note),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn delete_note(app: AppHandle<Wry>, id: String) -> Result<ModelDeleteResultData> {
    match Ctx::from_app(app) {
        Ok(ctx) => match NoteBmc::delete(ctx, &id).await {
            Ok(data) => Ok(data),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}

#[command]
pub async fn get_notes(app: AppHandle<Wry>) -> Result<Vec<Note>> {
    match Ctx::from_app(app) {
        Ok(ctx) => match NoteBmc::get_multi(ctx).await {
            Ok(notes) => Ok(notes),
            Err(err) => Err(err).into(),
        },
        Err(_) => Err(Error::CtxFail).into(),
    }
}
