const { Command } = require("discord-akairo");
const { Tier, Loot } = require("../../models");

module.exports = class LootAdd extends Command {
  constructor() {
    super("loot-add", {
      aliases: ["loot-add", "la"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        description: "Add to the lootbox",
        examples: [
          `loot:add "Bottle of Maple Syrup" Legendary`,
          "loot:add Syrup Common"
        ],
        usage: "<name> <tier>"
      },
      options: {
        permissions: ["MANAGE_CHANNELS"]
      },
      args: [
        {
          id: "name",
          prompt: {
            start: "What is the name of the loot?"
          },
          type: "string"
        },
        {
          id: "tier",
          prompt: {
            start: "What is the tier?"
          },
          type: "string"
        }
      ]
    });
  }

  async exec(msg, { name, tier }) {
    const guild = msg.guild.id;

    try {
      const { id: tier_id } = await Tier.findOne({
        where: { name: tier, guild }
      });

      if (!tier_id) {
        return msg.channel.send(
          "A valid tier must be provided when the type is set to tier."
        );
      }

      const [, added] = await Loot.findOrCreate({
        where: { name: tier.name, guild },
        defaults: { name, tier_id }
      });

      if (added) {
        return msg.channel.send(`${name} added.`);
      } else {
        return msg.channel.send(`${name} already exists.`);
      }
    } catch (error) {
      return msg.channel.send(`An error occurred adding ${name}`);
    }
  }
};
