CREATE TABLE
  IF NOT EXISTS sessions (
    id INTEGER NOT NULL PRIMARY KEY,
    duration INTEGER NOT NULL,
    summary TEXT,
    started_at INTEGER NOT NULL,
    finished_at INTEGER NOT NULL DEFAULT (strftime ('%s', 'now', 'localtime')),
    intent_id INTEGER NOT NULL,
    FOREIGN KEY (intent_id) REFERENCES intents (id)
  );
