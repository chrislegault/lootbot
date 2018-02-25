const { Command } = require("discord.js-commando");
const database = require("../../database");
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
          type: "string",
          validate: async (name, msg) => {
            const guild = msg.guild.id;
            const loot = await database.get({ name, guild });

            if (loot) return true;
            return "Loot not found";
          }
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
    const loot = await database.get({ name, guild });

    const result = await database.update(loot.id, {
      name: newName || loot.name,
      weight: weight || loot.weight,
      luckyWeight: luckyWeight || loot.luckyWeight,
      tier: tier || loot.tier
    });

    return msg.say(`${newName || loot.name} updated`);
  }
};
