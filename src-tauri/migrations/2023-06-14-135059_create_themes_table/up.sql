CREATE TABLE
  IF NOT EXISTS themes (
    id INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    favorite BOOLEAN NOT NULL DEFAULT 0,
    window_hex VARCHAR(7) NOT NULL,
    base_hex VARCHAR(7) NOT NULL,
    text_hex VARCHAR(7) NOT NULL,
    primary_hex VARCHAR(7) NOT NULL
  )
