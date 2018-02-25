const path = require("path");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const database = require("./database");
const SequelizeProvider = require("./providers/sequelize-provider");

require("dotenv").config();

const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  commandPrefix: "!lootbot",
  disableEveryone: true,
  unknownCommandResponse: false
});

client.setProvider(
  database.authenticate().then(() => new SequelizeProvider(database))
);
client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

client.registry
  .registerDefaults()
  .registerGroups([["loot", "Loot"]])
  .registerCommandsIn({
    dirname: path.join(__dirname, "commands"),
    excludeDirs: /^__tests__$/
  });

client.login(process.env.DISCORD_TOKEN);
