const { Command } = require("discord.js-commando");
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "remove",
      group: "loot",
      memberName: "remove",
      description: "Remove that loot",
      examples: [`remove "Maple Syrup"`],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the name of the loot?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, { name }) {
    const guild = msg.guild.id;

    try {
      const loot = await database.get({ name, guild });
      const result = await database.delete(loot.id);

      return msg.say(`${name} removed`);
    } catch (error) {
      return msg.say(`An error occurred removing ${name}`);
    }
  }
};
