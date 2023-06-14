CREATE TABLE
  IF NOT EXISTS scripts (
    id INTEGER NOT NULL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT 0,
    exec_on_session_start BOOLEAN NOT NULL DEFAULT 0,
    exec_on_session_pause BOOLEAN NOT NULL DEFAULT 0,
    exec_on_session_complete BOOLEAN NOT NULL DEFAULT 0,
    exec_on_break_start BOOLEAN NOT NULL DEFAULT 0,
    exec_on_break_pause BOOLEAN NOT NULL DEFAULT 0,
    exec_on_break_complete BOOLEAN NOT NULL DEFAULT 0
  )
