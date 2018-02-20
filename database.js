const sqlite = require("sqlite");

const dbPromise = Promise.resolve()
  .then(() => sqlite.open("./lootbot.db", { Promise }))
  .then(db => db.migrate())
  .catch(console.err);

module.exports = {
  dbPromise,
  list: async () => {
    const db = await dbPromise;
    return db.all("SELECT * FROM loot");
  },
  get: async name => {
    const db = await dbPromise;
    return db.get("SELECT * FROM loot WHERE name = ?", [name]);
  },
  insert: async item => {
    const db = await dbPromise;
    const { lastID } = await db.run(
      "INSERT INTO loot(name, weight, luckyWeight) VALUES(?, ?, ?)",
      [item.name, item.weight, item.luckyWeight]
    );

    return db.get("SELECT * FROM loot WHERE id = ?", [lastID]);
  },
  update: async (currentName, { name, weight, luckyWeight }) => {
    const db = await dbPromise;
    return db.run(
      "UPDATE loot SET name = ?, weight = ?, luckyWeight = ? WHERE name = ?",
      [name, weight, luckyWeight, currentName]
    );
  },
  delete: async name => {
    const db = await dbPromise;
    return db.run("DELETE FROM loot WHERE name = ?", [name]);
  }
};
