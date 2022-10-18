//! Base and low level Backend Model Controller functions

use super::{fire_model_event, ModelDeleteResultData};
use crate::ctx::Ctx;
use crate::prelude::*;
use crate::store::{Creatable, Patchable};
use std::sync::Arc;
use surrealdb::sql::Object;

pub async fn bmc_get<E>(ctx: Arc<Ctx>, _entity: &'static str, id: &str) -> Result<E>
where
    E: TryFrom<Object, Error = Error>,
{
    ctx.get_store().exec_get(id).await?.try_into()
}

pub async fn bmc_create<D, E>(ctx: Arc<Ctx>, entity: &'static str, data: D) -> Result<E>
where
    D: Creatable,
    E: TryFrom<Object, Error = Error>,
{
    let result_data = ctx.get_store().exec_create(entity, data).await?;

    fire_model_event(&ctx, entity, "create", result_data.clone());

    result_data.try_into()
}

pub async fn bmc_update<D, E>(ctx: Arc<Ctx>, entity: &'static str, id: &str, data: D) -> Result<E>
where
    D: Patchable,
    E: TryFrom<Object, Error = Error>,
{
    let result_data = ctx.get_store().exec_merge(id, data).await?;

    fire_model_event(&ctx, entity, "update", result_data.clone());

    result_data.try_into()
}

pub async fn bmc_delete(
    ctx: Arc<Ctx>,
    entity: &'static str,
    id: &str,
) -> Result<ModelDeleteResultData> {
    let id = ctx.get_store().exec_delete(id).await?;
    let result_data = ModelDeleteResultData::from(id);

    fire_model_event(&ctx, entity, "delete", result_data.clone());

    Ok(result_data)
}

pub async fn bmc_list<E>(ctx: Arc<Ctx>, entity: &'static str) -> Result<Vec<E>>
where
    E: TryFrom<Object, Error = Error>,
{
    // query for the Surreal Objects
    let objects = ctx.get_store().exec_select(entity).await?;

    // then get the entities
    objects
        .into_iter()
        .map(|o| o.try_into())
        .collect::<Result<_>>()
}
