const { RichEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const numeral = require("numeral");
const database = require("../../database");

function formatOdd(odd, total) {
  const percent = numeral(odd / total).format("0.00%");
  return `${percent} (${odd} in ${total})`;
}

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "list",
      group: "loot",
      memberName: "list",
      description: "List the glorious loot",
      examples: ["list"]
    });
  }

  async run(msg) {
    const guild = msg.guild.id;
    let loot = await database.list(guild);
    loot = loot.sort((lootA, lootB) => lootA.weight - lootB.weight);

    if (loot.length === 0) {
      return msg.say("No loot found.");
    }

    let totalOdds = 0;
    let totalLucky = 0;
    let lootRow = "";
    let oddsRow = "";
    let luckyRow = "";
    let tierRow = "";

    let messages = {
      Common: "__**Common**__\n",
      Uncommon: "__**Uncommon**__\n",
      Rare: "__**Rare**__\n",
      Legendary: "__**Legendary**__\n"
    };

    loot.forEach(reward => {
      totalOdds += reward.weight;
      totalLucky += reward.luckyWeight;
    });

    loot.forEach(reward => {
      messages[reward.tier] += `**${reward.name}** - ${formatOdd(
        reward.weight,
        totalOdds
      )}, ${formatOdd(reward.luckyWeight, totalLucky)}\n`;
    });

    return msg.say(
      `${messages.Common}\n${messages.Uncommon}\n${messages.Rare}\n${
        messages.Legendary
      }`
    );
  }
};
