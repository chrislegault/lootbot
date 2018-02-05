const path = require("path");
const { CommandoClient } = require("discord.js-commando");

const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  commandPrefix: "!lootbot",
  disableEveryone: true
});

require("dotenv").config();

client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

client.registry
  .registerDefaults()
  .registerGroups([["loot", "Loot"]])
  .registerCommandsIn({
    dirname: path.join(__dirname, "commands"),
    excludeDirs: /^__tests__$/
  });

client.login(process.env.DISCORD_TOKEN);
