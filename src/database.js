const path = require("path");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("", "", "", {
  host: "localhost",
  dialect: "sqlite",
  storage: path.resolve(__dirname, "lootbot.db"),
  operatorsAliases: false
});

sequelize.define("loot", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  luckyWeight: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  guild: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tier: {
    type: Sequelize.STRING,
    allowNull: false
  }
  // id INTEGER PRIMARY KEY,
  // name TEXT NOT NULL,
  // weight REAL NOT NULL,
  // luckyWeight REAL NOT NULL,
  // guild TEXT NOT NULL,
  // tier TEXT NOT NULL,
  // CONSTRAINT uniq_loot UNIQUE (name)
});

//console.log(sequelize.authenticate);

module.exports = sequelize;
// const sqlite = require("sqlite");

// const dbPromise = Promise.resolve()
//   .then(() => sqlite.open("./lootbot.db", { Promise }))
//   .then(db => db.migrate())
//   .catch(console.err);

// module.exports = {
//   dbPromise,
//   list: async guild => {
//     const db = await dbPromise;
//     return db.all("SELECT * FROM loot WHERE guild = ?", [guild]);
//   },
//   get: async ({ name, guild }) => {
//     const db = await dbPromise;

//     return db.get("SELECT * FROM loot WHERE name = ? AND guild = ?", [
//       name,
//       guild
//     ]);
//   },
//   insert: async item => {
//     const db = await dbPromise;
//     const { lastID } = await db.run(
//       "INSERT INTO loot(name, weight, luckyWeight, tier, guild) VALUES(?, ?, ?, ?, ?)",
//       [item.name, item.weight, item.luckyWeight, item.tier, item.guild]
//     );

//     return db.get("SELECT * FROM loot WHERE id = ?", [lastID]);
//   },
//   update: async (id, { name, weight, luckyWeight, tier }) => {
//     const db = await dbPromise;
//     return db.run(
//       "UPDATE loot SET name = ?, weight = ?, luckyWeight = ?, tier = ? WHERE id = ?",
//       [name, weight, luckyWeight, tier, id]
//     );
//   },
//   delete: async id => {
//     const db = await dbPromise;
//     return db.run("DELETE FROM loot WHERE id = ?", [id]);
//   }
// };
