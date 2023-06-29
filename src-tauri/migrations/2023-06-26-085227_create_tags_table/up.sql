CREATE TABLE
  IF NOT EXISTS tags (
    id INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(32) NOT NULL
  );

CREATE TABLE
  IF NOT EXISTS intent_tags (
    id INTEGER NOT NULL PRIMARY KEY,
    intent_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (intent_id) REFERENCES intents (id),
    FOREIGN KEY (tag_id) REFERENCES tags (id)
  );