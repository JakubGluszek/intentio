use crate::prelude::Seconds;

enum SessionType {
    Focus,
    Break,
    LongBreak,
}

pub struct Session {
    _type: SessionType,
    duration: Seconds,
    elapsed_time: Seconds,
    iterations: i64,
    is_playing: bool,
    started_at: Option<String>,
    intent_id: Option<String>,
}

impl Session {
    pub fn update(mut self, data: Session) {
        self = data
    }
}

pub struct State {
    session: Session,
}
