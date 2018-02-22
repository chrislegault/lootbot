const sqlite = require("sqlite");

const dbPromise = Promise.resolve()
  .then(() => sqlite.open("./lootbot.db", { Promise }))
  .then(db => db.migrate())
  .catch(console.err);

module.exports = {
  dbPromise,
  list: async guild => {
    const db = await dbPromise;
    return db.all("SELECT * FROM loot WHERE guild = ?", [guild]);
  },
  get: async ({ name, guild }) => {
    const db = await dbPromise;

    return db.get("SELECT * FROM loot WHERE name = ? AND guild = ?", [
      name,
      guild
    ]);
  },
  insert: async item => {
    const db = await dbPromise;
    const { lastID } = await db.run(
      "INSERT INTO loot(name, weight, luckyWeight, guild) VALUES(?, ?, ?, ?)",
      [item.name, item.weight, item.luckyWeight, item.guild]
    );

    return db.get("SELECT * FROM loot WHERE id = ?", [lastID]);
  },
  update: async (id, { name, weight, luckyWeight }) => {
    const db = await dbPromise;
    return db.run(
      "UPDATE loot SET name = ?, weight = ?, luckyWeight = ? WHERE id = ?",
      [name, weight, luckyWeight, currentName]
    );
  },
  delete: async id => {
    const db = await dbPromise;
    return db.run("DELETE FROM loot WHERE id = ?", [id]);
  }
};
