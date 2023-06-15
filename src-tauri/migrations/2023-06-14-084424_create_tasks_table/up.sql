CREATE TABLE
  IF NOT EXISTS tasks (
    id INTEGER NOT NULL PRIMARY KEY,
    body TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (strftime ('%s', 'now', 'localtime')),
    finished_at INTEGER,
    intent_id INTEGER NOT NULL,
    FOREIGN KEY (intent_id) REFERENCES intents (id)
  );
