const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const db = require("./models");
//const { db, start } = require("./database");
const SequelizeProvider = require("./providers/sequelize-provider");

require("dotenv").config();

const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  commandPrefix: "!lootbot",
  disableEveryone: true,
  unknownCommandResponse: false
});

client.setProvider(
  db.sequelize.authenticate().then(() => new SequelizeProvider(db.sequelize))
);

client.registry
  .registerDefaults()
  .registerGroups([["loot", "Loot"]])
  .registerCommandsIn({
    dirname: path.join(__dirname, "commands"),
    excludeDirs: /^__tests__$/
  });

client.login(process.env.DISCORD_TOKEN);
