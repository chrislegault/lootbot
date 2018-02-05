const { Command } = require("discord.js-commando");
const chance = require("chance")();

const rewards = [
  {
    name: "Change Name",
    weight: 25
  },
  {
    name: "Change Color",
    weight: 25
  },
  {
    name: "Minor Reward",
    weight: 50
  }
];

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

  async run(msg, args) {
    const weights = rewards.reduce(
      (memo, reward) => memo.concat(reward.weight),
      []
    );

    const reward = chance.weighted(rewards, weights);

    return msg.say(`Congratulations, you won ${reward.name}!`);
  }
};
