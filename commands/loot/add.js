const { Command } = require("discord.js-commando");
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "add",
      group: "loot",
      memberName: "add",
      description: "Add to the lootbox",
      examples: [`add "Bottle of Maple Syrup" 25 75`, "add Syrup 50 50"],
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
        }
      ]
    });
  }

  async run(msg, args) {
    const guild = msg.guild.id;
    const { name } = args;
    const loot = await database.get({ name, guild });

    if (loot) {
      return msg.say(`Loot named ${name} already found.`);
    }

    try {
      const result = await database.insert({ ...args, guild });
      return msg.say(`${name} added.`);
    } catch (error) {
      return msg.say(`An error occurred adding ${name}`);
    }
  }
};
