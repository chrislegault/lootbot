const { Command } = require("discord.js-commando");
const chance = require("chance")();
const database = require("../../database");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "open",
      group: "loot",
      memberName: "reply",
      description: "Opens a lootbox",
      examples: ["open"],
      args: [
        {
          key: "user",
          prompt: "Which user would you like to open a lootbox for?",
          type: "member"
        }
      ]
    });
  }

  async run(msg) {
    const loot = await database.list();

    if (loot.length === 0) {
      return msg.say("No loot in the lootbox.");
    }

    const weights = loot.reduce(
      (memo, reward) => memo.concat(reward.weight),
      []
    );

    const reward = chance.weighted(loot, weights);

    return msg.say(`Congratulations, you won ${reward.name}!`);
  }
};
