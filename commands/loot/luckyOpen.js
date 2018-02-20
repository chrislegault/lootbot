const { Command } = require("discord.js-commando");
const chance = require("chance")();
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "luckyopen",
      group: "loot",
      memberName: "luckyopen",
      description: "Opens a lucky lootbox",
      examples: ["luckyopen"],
      args: [
        {
          key: "user",
          prompt: "Which user would you like to open a lucky lootbox for?",
          type: "member"
        }
      ]
    });
  }

  async run(msg, args) {
    const loot = await database.list();

    const weights = loot.reduce(
      (memo, reward) => memo.concat(reward.luckyWeight),
      []
    );
    const reward = chance.weighted(loot, weights);

    return msg.say(`Congratulations, you won ${reward.name}!`);
  }
};
