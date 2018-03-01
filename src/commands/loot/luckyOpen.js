const { Command } = require("discord.js-commando");

module.exports = class LootLuckyOpen extends Command {
  constructor(client) {
    super(client, {
      name: "loot:luckyopen",
      group: "loot",
      memberName: "luckyopen",
      description: "Opens a lucky lootbox",
      examples: ["loot:luckyopen"],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "Which user would you like to open a lucky lootbox for?",
          type: "member"
        }
      ]
    });
  }

  async run() {}
};
