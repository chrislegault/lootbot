const { Command } = require("discord.js-commando");
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "remove",
      group: "loot",
      memberName: "remove",
      description: "Remove that loot",
      examples: [`remove "Maple Syrup"`],
      args: [
        {
          key: "name",
          prompt: "What is the name of the loot?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, { name }) {
    // var loot = await database.get(args.name);

    // if (!loot) {
    //   return msg.say(`Loot named ${args.name} not found.`);
    // }

    const result = await database.delete(name);
    return msg.say(`${name} removed`);
  }
};
