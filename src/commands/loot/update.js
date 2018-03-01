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
          type: "string"
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

  async run(msg, newValues) {
    const guild = msg.guild.id;
    let updates = {};
    let name = newValues.existingName;

    Object.keys(newValues).forEach(key => {
      if (newValues[key] && key !== "existingName" && key !== "tier") {
        updates[key] = newValues[key];
      }
    });

    try {
      const tier = await Tier.findOne({
        where: { name: newValues.tier }
      });

      updates = { ...updates, tier_id: tier.id };

      const [updated] = await Loot.update(updates, {
        where: { name, guild }
      });

      if (updated === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${newValues.name || name} updated`);
      }
    } catch (e) {
      msg.say(`An error occurred updating ${name}`);
    }
  }
};
