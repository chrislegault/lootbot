const { Command } = require("discord.js-commando");
const { Loot } = require("../../models");
const { isValidTier } = require("../../support/validations");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "update",
      group: "loot",
      memberName: "update",
      description: "Update that loot",
      examples: [
        `update "Maple Syrup" 25 75 Legendary "New Maple Syrup"`,
        `update "Maple Syrup" 25 75 Uncommon`
      ],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the name of the loot?",
          type: "string"
        },
        {
          key: "weight",
          prompt: "What is the normal weight of the loot?",
          type: "float",
          default: ""
        },
        {
          key: "luckyWeight",
          prompt: "What is the lucky weight of the loot?",
          type: "float",
          default: ""
        },
        {
          key: "tier",
          prompt: "What is the tier? (Common, Uncommon, Rare or Legendary)",
          type: "string",
          validate: isValidTier,
          default: ""
        },
        {
          key: "newName",
          prompt: "What is the new name of the loot?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(msg, { name, newName, weight, luckyWeight, tier }) {
    const guild = msg.guild.id;
    let updates = {};

    if (newName) {
      updates.name = newName;
    }

    if (weight) {
      updates.weight = weight;
    }

    if (luckyWeight) {
      updates.luckyWeight = luckyWeight;
    }

    if (tier) {
      updates.tier = tier;
    }

    try {
      const [updated] = await Loot.update(updates, {
        where: { name, guild }
      });

      if (updated === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${newName || name} updated`);
      }
    } catch (e) {
      msg.say(`An error occurred updating ${name}`);
    }
  }
};
