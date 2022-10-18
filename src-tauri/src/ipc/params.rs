use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateParams<D> {
    pub data: D,
}

#[derive(Deserialize)]
pub struct UpdateParams<D> {
    pub id: String,
    pub data: D,
}

#[derive(Deserialize)]
pub struct ListParams<F> {
    pub filter: Option<F>,
}

#[derive(Deserialize)]
pub struct GetParams {
    pub id: String,
}

#[derive(Deserialize)]
pub struct DeleteParams {
    pub id: String,
}
