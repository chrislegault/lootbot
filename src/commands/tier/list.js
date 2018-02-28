const { Command } = require("discord.js-commando");
const numeral = require("numeral");
const { Tier } = require("../../models");

function formatOdd(odd, total) {
  const percent = numeral(odd / total).format("0.00%");
  return `${percent} (${odd} in ${total})`;
}

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "tier:list",
      group: "tier",
      memberName: "tier:list",
      description: "List the glorious tiers",
      examples: ["tier:list"]
    });
  }

  async run(msg) {
    const guild = msg.guild.id;

    let tiers = await Tier.findAll({
      where: { guild },
      order: [["weight", "DESC"]]
    });

    if (tiers.length === 0) {
      return msg.say("No loot found.");
    }

    let totalOdds = 0;
    let totalLucky = 0;
    let message = "";

    //let messages = {};

    tiers.forEach(reward => {
      totalOdds += reward.weight;
      totalLucky += reward.luckyWeight;
    });

    tiers.forEach(tier => {
      message += `__**${tier.name}**__\n`;
      message += `Color: ${tier.color}\n`;
      message += `Image: ${tier.image}\n`;
      message += `Weight: ${formatOdd(tier.weight, totalOdds)}\n`;
      message += `Lucky Weight: ${formatOdd(tier.luckyWeight, totalLucky)}\n\n`;
    });

    return msg.say(message);
  }
};
