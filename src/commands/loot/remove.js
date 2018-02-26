const { Command } = require("discord.js-commando");
const { Loot } = require("../../models");

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
      const result = await Loot.destroy({
        where: { name, guild }
      });

      if (result === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${name} removed`);
      }
    } catch (e) {
      msg.say(`An error occurred removing ${name}`);
    }
  }
};
