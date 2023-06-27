// @generated automatically by Diesel CLI.

diesel::table! {
    intent_tags (id) {
        id -> Integer,
        intent_id -> Integer,
        tag_id -> Integer,
    }
}

diesel::table! {
    intents (id) {
        id -> Integer,
        label -> Text,
        pinned -> Bool,
        created_at -> BigInt,
        archived_at -> Nullable<BigInt>,
    }
}

diesel::table! {
    scripts (id) {
        id -> Integer,
        label -> Text,
        body -> Text,
        enabled -> Bool,
        exec_on_session_start -> Bool,
        exec_on_session_pause -> Bool,
        exec_on_session_complete -> Bool,
        exec_on_break_start -> Bool,
        exec_on_break_pause -> Bool,
        exec_on_break_complete -> Bool,
    }
}

diesel::table! {
    sessions (id) {
        id -> Integer,
        duration -> Integer,
        summary -> Nullable<Text>,
        started_at -> BigInt,
        finished_at -> BigInt,
        intent_id -> Integer,
    }
}

diesel::table! {
    tags (id) {
        id -> Integer,
        label -> Text,
    }
}

diesel::table! {
    tasks (id) {
        id -> Integer,
        body -> Text,
        completed -> Bool,
        created_at -> BigInt,
        finished_at -> Nullable<BigInt>,
        intent_id -> Integer,
    }
}

diesel::table! {
    themes (id) {
        id -> Integer,
        label -> Text,
        favorite -> Bool,
        window_hex -> Text,
        base_hex -> Text,
        text_hex -> Text,
        primary_hex -> Text,
        variant -> Text,
    }
}

diesel::joinable!(intent_tags -> intents (intent_id));
diesel::joinable!(intent_tags -> tags (tag_id));
diesel::joinable!(sessions -> intents (intent_id));
diesel::joinable!(tasks -> intents (intent_id));

diesel::allow_tables_to_appear_in_same_query!(
    intent_tags,
    intents,
    scripts,
    sessions,
    tags,
    tasks,
    themes,
);
