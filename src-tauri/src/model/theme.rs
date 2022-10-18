use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result},
    store::{Creatable, Patchable},
    utils::{map, XTakeVal},
};

use super::{
    bmc_base::{bmc_create, bmc_delete, bmc_get, bmc_list, bmc_update},
    ModelDeleteResultData,
};

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Theme {
    id: String,
    name: String,
    window_hex: String,
    base_hex: String,
    primary_hex: String,
    text_hex: String,
}

impl TryFrom<Object> for Theme {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Theme> {
        let theme = Theme {
            id: val.x_take_val("id")?,
            name: val.x_take_val("name")?,
            window_hex: val.x_take_val("window_hex")?,
            base_hex: val.x_take_val("base_hex")?,
            primary_hex: val.x_take_val("primary_hex")?,
            text_hex: val.x_take_val("text_hex")?,
        };

        Ok(theme)
    }
}

#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ThemeForCreate {
    name: String,
    window_hex: String,
    base_hex: String,
    primary_hex: String,
    text_hex: String,
}

impl From<ThemeForCreate> for Value {
    fn from(val: ThemeForCreate) -> Value {
        let data = map![
            "name".into() => val.name.into(),
            "window_hex".into() => val.window_hex.into(),
            "base_hex".into() => val.base_hex.into(),
            "primary_hex".into() => val.primary_hex.into(),
            "text_hex".into() => val.text_hex.into(),
        ];

        Value::Object(data.into())
    }
}

impl Creatable for ThemeForCreate {}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct ThemeForUpdate {
    name: Option<String>,
    window_hex: Option<String>,
    base_hex: Option<String>,
    primary_hex: Option<String>,
    text_hex: Option<String>,
}

impl From<ThemeForUpdate> for Value {
    fn from(val: ThemeForUpdate) -> Self {
        let mut data = BTreeMap::new();
        if let Some(name) = val.name {
            data.insert("name".into(), name.into());
        }
        if let Some(window_hex) = val.window_hex {
            data.insert("window_hex".into(), window_hex.into());
        }
        if let Some(base_hex) = val.base_hex {
            data.insert("base_hex".into(), base_hex.into());
        }
        if let Some(primary_hex) = val.primary_hex {
            data.insert("primary_hex".into(), primary_hex.into());
        }
        if let Some(text_hex) = val.text_hex {
            data.insert("text_hex".into(), text_hex.into());
        }
        Value::Object(data.into())
    }
}

impl Patchable for ThemeForUpdate {}

pub struct ThemeBmc {}

impl ThemeBmc {
    const ENTITY: &'static str = "theme";

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Theme> {
        bmc_get::<Theme>(ctx, Self::ENTITY, id).await
    }

    pub async fn create(ctx: Arc<Ctx>, data: ThemeForCreate) -> Result<Theme> {
        bmc_create(ctx, Self::ENTITY, data).await
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ThemeForUpdate) -> Result<Theme> {
        bmc_update(ctx, Self::ENTITY, id, data).await
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        bmc_delete(ctx, Self::ENTITY, id).await
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Theme>> {
        bmc_list(ctx, Self::ENTITY).await
    }
}
