const { Command } = require("discord.js-commando");
const { Tier } = require("../../models");

module.exports = class TierRemove extends Command {
  constructor(client) {
    super(client, {
      name: "tier:remove",
      group: "tier",
      memberName: "remove",
      description: "Remove a tier",
      examples: [`tier:remove Common`],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the name of the tier?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, { name }) {
    const guild = msg.guild.id;

    try {
      const result = await Tier.destroy({
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
