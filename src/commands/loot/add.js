const { Command } = require("discord.js-commando");
const { Loot } = require("../../models");
const { isValidTier } = require("../../support/validations");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "add",
      group: "loot",
      memberName: "add",
      description: "Add to the lootbox",
      examples: [
        `add "Bottle of Maple Syrup" 25 75 Legendary`,
        "add Syrup 50 50 Common"
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
          type: "float"
        },
        {
          key: "luckyWeight",
          prompt: "What is the lucky weight of the loot?",
          type: "float"
        },
        {
          key: "tier",
          prompt: "What is the tier? (Common, Uncommon, Rare or Legendary)",
          type: "string",
          validate: isValidTier
        }
      ]
    });
  }

  async run(msg, args) {
    const guild = msg.guild.id;
    const { name } = args;

    try {
      const [, added] = await Loot.findOrCreate({
        where: { name, guild },
        defaults: args
      });

      if (added) {
        msg.say(`${name} added.`);
      } else {
        msg.say(`${name} already exists.`);
      }
    } catch (error) {
      msg.say(`An error occurred adding ${name}`);
    }
  }
};
