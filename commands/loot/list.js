const { Command } = require("discord.js-commando");
const database = require("../../database");

function formatOdd(odd, total) {
  return `${odd} in ${total}`;
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
    const loot = await database.list(guild);

    if (loot.length === 0) {
      return msg.say("No loot found.");
    }

    let table = "";
    let longestWord = "Loot".length;
    let longestOdds = "Odds".length;
    let longestLucky = "Lucky Odds".length;
    let totalOdds = 0;
    let totalLucky = 0;

    loot.forEach(reward => {
      totalOdds += reward.weight;
      totalLucky += reward.luckyWeight;
    });

    loot.forEach(reward => {
      let odd = formatOdd(reward.weight, totalOdds);
      let luckyOdd = formatOdd(reward.luckyWeight, totalOdds);

      if (reward.name.length > longestWord) {
        longestWord = reward.name.length;
      }

      if (odd.length > longestOdds) {
        longestOdds = odd.length;
      }

      if (luckyOdd.length > longestLucky) {
        longestLucky = luckyOdd.length;
      }
    });

    table += `| ${"Loot".padEnd(longestWord)} | ${"Odds".padEnd(
      longestOdds
    )} | ${"Lucky Odds".padEnd(longestLucky)} |\n`;
    table += `| ${"".padEnd(longestWord, "-")} | ${"".padEnd(
      longestOdds,
      "-"
    )} | ${"".padEnd(longestLucky, "-")} |\n`;

    loot.forEach(reward => {
      let name = reward.name.padEnd(longestWord);
      let odds = formatOdd(reward.weight, totalOdds).padEnd(longestOdds);
      let lucky = formatOdd(reward.luckyWeight, totalLucky).padEnd(
        longestLucky
      );
      table += `| ${name} | ${odds} | ${lucky} |\n`;
    });

    return msg.say("```" + table + "```");
  }
};
