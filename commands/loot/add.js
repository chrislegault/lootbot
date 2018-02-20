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
    let loot = await database.get(args.name);

    if (loot) {
      return msg.say(`Loot named ${args.name} already found.`);
    }

    let { name } = await database.insert(args);

    return msg.say(`${name} added.`);
  }
};
