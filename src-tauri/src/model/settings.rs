//! All models and controller for the Settings type

use super::bmc_base::{bmc_get, bmc_update};
use super::Minutes;
use crate::ctx::Ctx;
use crate::prelude::*;
use crate::store::{Patchable, Store};
use crate::utils::{map, XTakeVal};
use serde::{Deserialize, Serialize};
use serde_with_macros::skip_serializing_none;
use std::collections::BTreeMap;
use std::sync::Arc;
use surrealdb::sql::{Object, Value};
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
// duration in minutes
pub struct Settings {
    pub pomodoro_duration: Minutes,
    pub break_duration: Minutes,
    pub long_break_duration: Minutes,
    pub long_break_interval: i64,
    pub auto_start_pomodoros: bool,
    pub auto_start_breaks: bool,
    pub alert_name: String,
    pub alert_path: String,
    pub alert_volume: f64,
    pub alert_repeat: i64,
}

impl TryFrom<Object> for Settings {
    type Error = Error;
    fn try_from(mut val: Object) -> Result<Settings> {
        let settings = Settings {
            pomodoro_duration: val.x_take_val("pomodoro_duration")?,
            break_duration: val.x_take_val("break_duration")?,
            long_break_duration: val.x_take_val("long_break_duration")?,
            long_break_interval: val.x_take_val("long_break_interval")?,
            auto_start_pomodoros: val.x_take_val("auto_start_pomodoros")?,
            auto_start_breaks: val.x_take_val("auto_start_breaks")?,
            alert_name: val.x_take_val("alert_name")?,
            alert_path: val.x_take_val("alert_path")?,
            alert_volume: val.x_take_val("alert_volume")?,
            alert_repeat: val.x_take_val("alert_repeat")?,
        };

        Ok(settings)
    }
}

impl From<Settings> for Value {
    fn from(val: Settings) -> Self {
        BTreeMap::from([
            ("pomodoro_duration".into(), val.pomodoro_duration.into()),
            ("break_duration".into(), val.break_duration.into()),
            ("long_break_duration".into(), val.long_break_duration.into()),
            ("long_break_interval".into(), val.long_break_interval.into()),
            (
                "auto_start_pomodoros".into(),
                val.auto_start_pomodoros.into(),
            ),
            ("auto_start_breaks".into(), val.auto_start_breaks.into()),
            ("alert_name".into(), val.alert_name.into()),
            ("alert_path".into(), val.alert_path.into()),
            ("alert_volume".into(), val.alert_volume.into()),
            ("alert_repeat".into(), val.alert_repeat.into()),
        ])
        .into()
    }
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            pomodoro_duration: 25,
            break_duration: 5,
            long_break_duration: 10,
            long_break_interval: 4,
            auto_start_pomodoros: false,
            auto_start_breaks: false,
            alert_name: "".into(),
            alert_path: "".into(),
            alert_volume: 0.50,
            alert_repeat: 2,
        }
    }
}

#[skip_serializing_none]
#[derive(Deserialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SettingsForUpdate {
    pub pomodoro_duration: Option<i64>,
    pub break_duration: Option<i64>,
    pub long_break_duration: Option<i64>,
    pub long_break_interval: Option<i64>,
    pub auto_start_pomodoros: Option<bool>,
    pub auto_start_breaks: Option<bool>,
    pub alert_name: Option<String>,
    pub alert_path: Option<String>,
    pub alert_volume: Option<i64>,
    pub alert_repeat: Option<i64>,
}

impl From<SettingsForUpdate> for Value {
    fn from(val: SettingsForUpdate) -> Self {
        let mut data: BTreeMap<String, Value> = BTreeMap::new();
        if let Some(pomodoro_duration) = val.pomodoro_duration {
            data.insert("pomodoro_duration".into(), pomodoro_duration.into());
        }
        if let Some(break_duration) = val.break_duration {
            data.insert("break_duration".into(), break_duration.into());
        }
        if let Some(long_break_duration) = val.long_break_duration {
            data.insert("long_break_duration".into(), long_break_duration.into());
        }
        if let Some(long_break_interval) = val.long_break_interval {
            data.insert("long_break_interval".into(), long_break_interval.into());
        }
        if let Some(auto_start_pomodoros) = val.auto_start_pomodoros {
            data.insert("auto_start_pomodoros".into(), auto_start_pomodoros.into());
        }
        if let Some(auto_start_breaks) = val.auto_start_breaks {
            data.insert("auto_start_breaks".into(), auto_start_breaks.into());
        }
        if let Some(alert_name) = val.alert_name {
            data.insert("alert_name".into(), alert_name.into());
        }
        if let Some(alert_path) = val.alert_path {
            data.insert("alert_path".into(), alert_path.into());
        }
        if let Some(alert_volume) = val.alert_volume {
            data.insert("alert_volume".into(), alert_volume.into());
        }
        if let Some(alert_repeat) = val.alert_repeat {
            data.insert("alert_repeat".into(), alert_repeat.into());
        }

        Value::Object(data.into())
    }
}

impl Patchable for SettingsForUpdate {}

pub struct SettingsBmc;

impl SettingsBmc {
    // single record
    const ENTITY: &'static str = "settings";
    const ID: &'static str = "settings:instance";

    pub async fn init(store: Arc<Store>) -> Result<()> {
        let sql = f!("CREATE {} CONTENT $data", Self::ID);

        let data = Settings::default();
        let data: Object = W(data.into()).try_into()?;

        let vars: BTreeMap<String, Value> = map!["data".into() => Value::from(data)];

        store
            .ds
            .execute(&sql, &store.ses, Some(vars), false)
            .await?;

        Ok(())
    }

    pub async fn restore_to_default(_ctx: Arc<Ctx>) {}

    pub async fn get(ctx: Arc<Ctx>) -> Result<Settings> {
        bmc_get(ctx, Self::ENTITY, Self::ENTITY).await
    }

    pub async fn update(ctx: Arc<Ctx>, data: SettingsForUpdate) -> Result<Settings> {
        bmc_update(ctx, Self::ENTITY, Self::ID, data).await
    }
}
