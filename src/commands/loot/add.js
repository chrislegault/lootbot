const { Command } = require("discord.js-commando");
const { Tier, Loot } = require("../../models");

module.exports = class LootAdd extends Command {
  constructor(client) {
    super(client, {
      name: "loot:add",
      group: "loot",
      memberName: "add",
      description: "Add to the lootbox",
      examples: [
        `loot:add "Bottle of Maple Syrup" Legendary`,
        "loot:add Syrup Common"
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
          key: "tier",
          prompt: "What is the tier?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, args) {
    const guild = msg.guild.id;
    const { name } = args;

    try {
      const tier = await Tier.findOne({
        where: { name: args.tier, guild }
      });

      const [, added] = await Loot.findOrCreate({
        where: { name, guild },
        defaults: { name, tier_id: tier.id }
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
