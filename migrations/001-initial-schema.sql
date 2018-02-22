-- Up
CREATE TABLE settings(
  guild INTEGER,
  settings TEXT
);

CREATE TABLE loot(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  weight REAL NOT NULL,
  luckyWeight REAL NOT NULL,
  guild TEXT NOT NULL,
  CONSTRAINT uniq_loot UNIQUE (name)
);

-- Down
DROP TABLE settings;
DROP TABLE loot;
