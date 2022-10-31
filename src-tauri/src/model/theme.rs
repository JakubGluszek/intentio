use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    ctx::Ctx,
    prelude::{Error, Result},
    store::{Creatable, Patchable, Store},
    utils::{map, XTakeVal},
};

use super::{fire_model_event, ModelDeleteResultData};

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Theme {
    id: String,
    name: String,
    default: bool,
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
            default: val.x_take_val("default")?,
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
    default: bool,
    window_hex: String,
    base_hex: String,
    primary_hex: String,
    text_hex: String,
}

impl From<ThemeForCreate> for Value {
    fn from(val: ThemeForCreate) -> Value {
        let data = map![
            "name".into() => val.name.into(),
            "default".into() => val.default.into(),
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

    pub async fn initialize(store: Arc<Store>) -> Result<()> {
        let objects = store.exec_select(Self::ENTITY).await?;

        if objects.len() == 0 {
            let sql = "
                CREATE theme:abyss CONTENT {
                    name: 'abyss',
                    default: true,
                    window_hex: '#222831',
                    base_hex: '#393E46',
                    primary_hex: '#00ADB5',
                    text_hex: '#EEEEEE',
                };
                CREATE theme:winter CONTENT {
                    name: 'winter',
                    default: true,
                    window_hex: '#F9F7F7',
                    base_hex: '#DBE2EF',
                    primary_hex: '#3F72AF',
                    text_hex: '#112D4E',
                };
                CREATE theme:dracula CONTENT {
                    name: 'dracula',
                    default: true,
                    window_hex: '#282a36',
                    base_hex: '#383a59',
                    primary_hex: '#bd93f9',
                    text_hex: '#f8f8f2',
                };
            ";

            store.ds.execute(sql, &store.ses, None, false).await?;
        }

        Ok(())
    }

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Theme> {
        ctx.get_store().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: ThemeForCreate) -> Result<Theme> {
        let result = ctx.get_store().exec_create(Self::ENTITY, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "create", result.clone());

        result.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ThemeForUpdate) -> Result<Theme> {
        let result = ctx.get_store().exec_merge(id, data).await?;

        fire_model_event(&ctx, Self::ENTITY, "update", result.clone());

        result.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let id = ctx.get_store().exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id);

        fire_model_event(&ctx, Self::ENTITY, "delete", result.clone());

        Ok(result)
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Theme>> {
        let objects = ctx.get_store().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}

#[cfg(test)]
mod tests {
    use surrealdb::sql::Array;

    use crate::{prelude::W, utils::get_test_store};

    use super::*;

    #[tokio::test]
    async fn default_themes() -> Result<()> {
        let store = get_test_store().await?;

        ThemeBmc::initialize(store.clone()).await?;

        let sql = "SELECT * FROM theme";
        let ress = store.ds.execute(sql, &store.ses, None, false).await?;
        let first_res = ress.into_iter().next().expect("should get a response");

        let array: Array = W(first_res.result?).try_into()?;

        assert_eq!(array.len(), 3);

        Ok(())
    }
}
