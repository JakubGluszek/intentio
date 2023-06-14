CREATE TABLE
  IF NOT EXISTS sessions (
    id INTEGER NOT NULL PRIMARY KEY,
    duration INTEGER NOT NULL,
    summary TEXT,
    started_at DATETIME NOT NULL,
    finished_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    intent_id INTEGER NOT NULL,
    FOREIGN KEY (intent_id) REFERENCES intents (id)
  );
