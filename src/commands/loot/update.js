const { Command } = require("discord.js-commando");
const { Loot, Tier } = require("../../models");

module.exports = class LootUpdate extends Command {
  constructor(client) {
    super(client, {
      name: "loot:update",
      group: "loot",
      memberName: "update",
      description: "Update that loot",
      examples: [
        `loot:update "Maple Syrup" 25 75 Legendary "New Maple Syrup"`,
        `loot:update "Maple Syrup" 25 75 Uncommon`
      ],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "existingName",
          prompt: "What is the name of the loot?",
          type: "string"
        },
        {
          key: "tier",
          prompt: "What is the new tier of the loot?",
          type: "string",
          default: ""
        },
        {
          key: "name",
          prompt: "What is the new name of the loot?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(msg, { existingName, tier, name }) {
    const guild = msg.guild.id;
    let updates = {};

    try {
      let foundTier = null;

      if (tier) {
        foundTier = await Tier.findOne({
          where: { name: tier }
        });

        if (!foundTier) {
          return msg.say("A valid tier must be provided.");
        }

        updates = { ...updates, tier_id: foundTier.id };
      }

      if (name) {
        updates = { ...updates, name };
      }

      const [updated] = await Loot.update(updates, {
        where: { name: existingName, guild }
      });

      if (updated === 0) {
        msg.say(`${existingName} not found`);
      } else {
        msg.say(`${name || existingName} updated`);
      }
    } catch (e) {
      msg.say(`An error occurred updating ${existingName}`);
    }
  }
};
