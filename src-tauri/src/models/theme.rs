use std::{collections::BTreeMap, sync::Arc};

use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

use crate::{
    cfg::InterfaceCfg,
    ctx::Ctx,
    database::{Creatable, Database, Patchable},
    prelude::{Error, Result, DEFAULT_THEME},
    utils::{map, XTakeVal},
};

use super::ModelDeleteResultData;

#[derive(Serialize, TS, Debug, Clone)]
#[ts(export, export_to = "../src/bindings/")]
pub struct Theme {
    id: String,
    name: String,
    favorite: bool,
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
            favorite: val.x_take_val("favorite")?,
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
            "favorite".into() => false.into(),
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
    favorite: Option<bool>,
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
        if let Some(favorite) = val.favorite {
            data.insert("favorite".into(), favorite.into());
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

    pub async fn init_default_themes(database: Arc<Database>) -> Result<()> {
        let objects = database.exec_select(Self::ENTITY).await?;

        if objects.len() == 0 {
            let sql = "
                CREATE theme:abyss CONTENT {
                    name: 'abyss',
                    favorite: false,
                    window_hex: '#222831',
                    base_hex: '#393E46',
                    primary_hex: '#00ADB5',
                    text_hex: '#EEEEEE',
                };
                CREATE theme:forest CONTENT {
                    name: 'forest',
                    favorite: false,
                    window_hex: '#002a37',
                    base_hex: '#09494e',
                    primary_hex: '#0feda2',
                    text_hex: '#bbbbbb',
                };
                CREATE theme:dracula CONTENT {
                    name: 'dracula',
                    window_hex: '#282a36',
                    favorite: false,
                    base_hex: '#383a59',
                    primary_hex: '#bd93f9',
                    text_hex: '#f8f8f2',
                };
                CREATE theme:space CONTENT {
                    name: 'space',
                    favorite: false,
                    window_hex: '#161853',
                    base_hex: '#292C6D',
                    primary_hex: '#EC255A',
                    text_hex: '#FAEDF0',
                };
                CREATE theme:blaze CONTENT {
                    name: 'blaze',
                    favorite: false,
                    window_hex: '#112B3C',
                    base_hex: '#205375',
                    primary_hex: '#F66B0E',
                    text_hex: '#EFEFEF',
                };
            ";

            database.ds.execute(sql, &database.ses, None, false).await?;
        }

        Ok(())
    }

    pub async fn get(ctx: Arc<Ctx>, id: &str) -> Result<Theme> {
        ctx.get_database().exec_get(id).await?.try_into()
    }

    pub async fn create(ctx: Arc<Ctx>, data: ThemeForCreate) -> Result<Theme> {
        let result = ctx.get_database().exec_create(Self::ENTITY, data).await?;

        ctx.emit_event("theme_created", result.clone());

        result.try_into()
    }

    pub async fn update(ctx: Arc<Ctx>, id: &str, data: ThemeForUpdate) -> Result<Theme> {
        let result = ctx.get_database().exec_merge(id, data).await?;

        ctx.emit_event("theme_updated", result.clone());

        result.try_into()
    }

    pub async fn delete(ctx: Arc<Ctx>, id: &str) -> Result<ModelDeleteResultData> {
        let id = ctx.get_database().exec_delete(id).await?;
        let result = ModelDeleteResultData::from(id);

        ctx.emit_event("theme_deleted", result.clone());

        let mut config = InterfaceCfg::get();

        if config.theme_id == result.id {
            config.theme_id = DEFAULT_THEME.to_string();

            InterfaceCfg::save(&config);

            ctx.emit_event("current_theme_changed", "");
        }

        Ok(result)
    }

    pub async fn delete_multi(
        ctx: Arc<Ctx>,
        ids: Vec<String>,
    ) -> Result<Vec<ModelDeleteResultData>> {
        let database = ctx.get_database();

        let mut data: Vec<ModelDeleteResultData> = vec![];

        for id in ids {
            let id = database.exec_delete(&id).await?;
            let result = ModelDeleteResultData::from(id);
            data.push(result);
        }

        ctx.emit_event("themes_deleted", data.clone());

        Ok(data)
    }

    pub async fn list(ctx: Arc<Ctx>) -> Result<Vec<Theme>> {
        let objects = ctx.get_database().exec_select(Self::ENTITY).await?;

        objects.into_iter().map(|o| o.try_into()).collect()
    }
}

#[cfg(test)]
mod tests {
    use surrealdb::sql::Array;

    use crate::prelude::W;

    use super::*;

    #[tokio::test]
    async fn default_themes() -> Result<()> {
        let ctx = Ctx::test().await;
        let database = ctx.get_database();

        ThemeBmc::init_default_themes(database.clone()).await?;

        let sql = "SELECT * FROM theme";
        let ress = database.ds.execute(sql, &database.ses, None, false).await?;
        let first_res = ress.into_iter().next().expect("should get a response");

        let array: Array = W(first_res.result?).try_into()?;

        assert_eq!(array.len(), 5);

        Ok(())
    }
}
