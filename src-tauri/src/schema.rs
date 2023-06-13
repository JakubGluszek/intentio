// @generated automatically by Diesel CLI.

diesel::table! {
    intents (id) {
        id -> Integer,
        label -> Text,
        pinned -> Bool,
        created_at -> Timestamp,
        archived_at -> Nullable<Timestamp>,
    }
}
