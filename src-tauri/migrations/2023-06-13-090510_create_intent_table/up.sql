CREATE TABLE
  IF NOT EXISTS intents (
    id INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    pinned BOOLEAN NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (strftime ('%s', 'now', 'localtime')),
    archived_at INTEGER
  );
