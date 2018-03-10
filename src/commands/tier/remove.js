const { Command } = require("discord-akairo");
const { Tier } = require("../../models");
const { checkManagePermissions } = require("../../support");

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
        permissions: checkManagePermissions
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
      const tier = await Tier.findOne({
        where: { name, guild }
      });

      if (!tier) {
        return msg.channel.send(`${name} not found`);
      }

      await tier.destroy();
      return msg.channel.send(`${name} removed`);
    } catch (e) {
      return msg.channel.send(`An error occurred removing ${name}`);
    }
  }
};
