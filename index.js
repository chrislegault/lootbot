const path = require("path");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { dbPromise } = require("./database");

require("dotenv").config();

const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  commandPrefix: "!lootbot",
  disableEveryone: true,
  unknownCommandResponse: false
});

client.setProvider(dbPromise.then(db => new SQLiteProvider(db)));
client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

client.registry
  .registerDefaults()
  .registerGroups([["loot", "Loot"]])
  .registerCommandsIn({
    dirname: path.join(__dirname, "commands"),
    excludeDirs: /^__tests__$/
  });

client.login(process.env.DISCORD_TOKEN);
