// Store layer to talk to the SurrealDB.
// This module is to narrow and normalize the lower level API surface
// to the rest of the application code (.e.g, Backend Model Controllers)

use crate::prelude::*;
use crate::utils::map;
use std::collections::BTreeMap;
use surrealdb::sql::{thing, Array, Object, Value};
use surrealdb::{Datastore, Session};

mod try_froms;
mod x_takes;

pub trait Creatable: Into<Value> {}
pub trait Patchable: Into<Value> {}
pub trait Filterable: Into<Value> {}

pub struct Store {
    pub ds: Datastore,
    pub ses: Session,
}

impl Store {
    pub async fn new() -> Result<Self> {
        let path = tauri::api::path::data_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_owned();

        let path = format!("file://{}/pomodoro.db", path);

        let ds = Datastore::new(&path).await?;
        let ses = Session::for_db("appns", "appdb");

        Ok(Store { ds, ses })
    }

    pub async fn exec_get(&self, tid: &str) -> Result<Object> {
        let sql = "SELECT * FROM $th";

        let vars = map!["th".into() => thing(tid)?.into()];

        let ress = self.ds.execute(sql, &self.ses, Some(vars), true).await?;

        let first_res = ress.into_iter().next().expect("Did not get a response");

        W(first_res.result?.first()).try_into()
    }

    pub async fn exec_create<T: Creatable>(&self, tb: &str, data: T) -> Result<Object> {
        let sql = "CREATE type::table($tb) CONTENT $data RETURN AFTER";
        let data: Object = W(data.into()).try_into()?;

        let vars = map![
			"tb".into() => tb.into(),
			"data".into() => Value::from(data)];

        let ress = self.ds.execute(sql, &self.ses, Some(vars), false).await?;
        let first_val = ress
            .into_iter()
            .next()
            .map(|r| r.result)
            .expect("data not returned")?;

        if let Value::Object(val) = first_val.first() {
            Ok(val)
        } else {
            Err(Error::StoreFailToCreate(f!(
                "exec_create {tb}, nothing returned."
            )))
        }
    }

    pub async fn exec_merge<T: Patchable>(&self, tid: &str, data: T) -> Result<Object> {
        let sql = "UPDATE $th MERGE $data RETURN AFTER";

        let vars = map![
			"th".into() => thing(tid)?.into(),
			"data".into() => data.into()];

        let ress = self.ds.execute(sql, &self.ses, Some(vars), true).await?;

        let first_res = ress.into_iter().next().expect("id not returned");

        let result = first_res.result?;

        if let Value::Object(val) = result.first() {
            Ok(val)
        } else {
            Err(Error::StoreFailToCreate(f!(
                "exec_merge {tid}, nothing returned."
            )))
        }
    }

    pub async fn exec_delete(&self, tid: &str) -> Result<String> {
        let sql = "DELETE $th";

        let vars = map!["th".into() => thing(tid)?.into()];

        let ress = self.ds.execute(sql, &self.ses, Some(vars), false).await?;

        let first_res = ress.into_iter().next().expect("Did not get a response");

        // Return the error if result failed
        first_res.result?;

        // return success
        Ok(tid.to_string())
    }

    pub async fn exec_select(&self, tb: &str) -> Result<Vec<Object>> {
        let sql = String::from("SELECT * FROM type::table($tb)");

        let vars = BTreeMap::from([("tb".into(), tb.into())]);

        let ress = self.ds.execute(&sql, &self.ses, Some(vars), false).await?;

        let first_res = ress.into_iter().next().expect("Did not get a response");

        // Get the result value as value array (fail if it is not)
        let array: Array = W(first_res.result?).try_into()?;

        // build the list of objects
        array.into_iter().map(|value| W(value).try_into()).collect()
    }
}
