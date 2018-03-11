const { Command } = require("discord-akairo");
const { Loot, Tier } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class LootUpdate extends Command {
  constructor() {
    super("loot-update", {
      aliases: ["loot-update", "lu"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        content: "Update a piece of loot in the lootbox",
        examples: [
          `loot-update "Maple Syrup" name="New Maple Syrup" tier=Legendary`,
          `loot-update Syrup tier=Legendary`
        ],
        usage: "<existingName> name=<name> tier=<tier>"
      },
      split: "sticky",
      options: {
        permissions: checkManagePermissions
      },
      args: [
        {
          id: "existingName",
          prompt: {
            start: "What is the name of the loot?"
          },
          type: "string"
        },
        {
          id: "name",
          prompt: {
            start: "What is the new name of the loot?",
            optional: true
          },
          match: "prefix",
          prefix: "name=",
          type: "string",
          default: null
        },
        {
          id: "tier",
          prompt: {
            start: "What is the new tier of the loot?",
            optional: true
          },
          match: "prefix",
          prefix: "tier=",
          type: "string",
          default: null
        }
      ]
    });
  }

  async exec(msg, { existingName, tier, ...updates }) {
    const guild = msg.guild.id;

    updates = Object.keys(updates).reduce((memo, key) => {
      if (updates[key] !== null) {
        memo[key] = updates[key];
      }

      return memo;
    }, {});

    try {
      let foundTier = null;

      if (tier) {
        foundTier = await Tier.findOne({
          where: { guild, name: tier }
        });

        if (!foundTier) {
          return msg.channel.send(`No tier named ${tier} found.`);
        }

        updates = { ...updates, tier_id: foundTier.id };
      }

      const [updated] = await Loot.update(updates, {
        where: { name: existingName, guild }
      });

      if (updated === 0) {
        return msg.channel.send(`${existingName} not found`);
      }

      return msg.channel.send(`${updates.name || existingName} updated`);
    } catch (error) {
      return msg.channel.send(`An error occurred updating ${existingName}`);
    }
  }
};
