const { Command } = require("discord-akairo");
const { Tier } = require("../../models");

module.exports = class TierRemove extends Command {
  constructor() {
    super("tier-remove", {
      aliases: ["tier-remove", "tr"],
      category: "Tier",
      channelRestriction: "guild",
      description: {
        content: "Remove a tier",
        examples: ["tier-remove Common"],
        usage: "<name>"
      },
      options: {
        permissions: ["MANAGE_CHANNELS"]
      },
      split: "quoted",
      args: [
        {
          id: "name",
          prompt: {
            start: "What is the name of the tier?"
          },
          type: "string"
        }
      ]
    });
  }

  async exec(msg, { name }) {
    const guild = msg.guild.id;

    try {
      const result = await Tier.destroy({
        where: { name, guild }
      });

      if (result === 0) {
        return msg.channel.send(`${name} not found`);
      } else {
        return msg.channel.send(`${name} removed`);
      }
    } catch (e) {
      return msg.channel.send(`An error occurred removing ${name}`);
    }
  }
};
