const { Command } = require("discord-akairo");
const { Tier, Loot } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class LootAdd extends Command {
  constructor() {
    super("loot-add", {
      aliases: ["loot-add", "la"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        content: "Add loot to the lootbox",
        examples: [
          `loot-add "Bottle of Maple Syrup" Legendary`,
          "loot-add Syrup Common"
        ],
        usage: "<name> <tier>"
      },
      split: "quoted",
      options: {
        permissions: checkManagePermissions
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
      const foundTier = await Tier.findOne({
        where: { name: tier, guild }
      });

      if (!foundTier) {
        return msg.channel.send("A valid tier must be provided.");
      }

      const [, added] = await Loot.findOrCreate({
        where: { name: foundTier.name, guild },
        defaults: { name, tier_id: foundTier.id }
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
