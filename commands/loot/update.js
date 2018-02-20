const { Command } = require("discord.js-commando");
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "update",
      group: "loot",
      memberName: "update",
      description: "Update that loot",
      examples: [
        `update "Maple Syrup" "New Maple Syrup" 25 75`,
        `update "Maple Syrup" "" 25 75`
      ],
      args: [
        {
          key: "name",
          prompt: "What is the name of the loot?",
          type: "string"
        },
        {
          key: "newName",
          prompt: "What is the new name of the loot?",
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

  async run(msg, { name, newName, weight, luckyWeight }) {
    const result = await database.update(name, {
      name: newName,
      weight: weight,
      luckyWeight: luckyWeight
    });

    return msg.say("Loot updated");
  }
};
