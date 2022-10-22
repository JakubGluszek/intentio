use crate::{prelude::Result, store::Store};
use std::sync::Arc;
use surrealdb::{Datastore, Session};

pub async fn get_test_store() -> Result<Arc<Store>> {
    let ds = Datastore::new("memory").await?;
    let ses = Session::for_db("appns", "appdb");
    Ok(Arc::new(Store { ds, ses }))
}
