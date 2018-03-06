const { Command } = require("discord-akairo");
const { Tier } = require("../../models");
const { formatOdd, checkManagePermissions } = require("../../support");

module.exports = class TierList extends Command {
  constructor() {
    super("tier-list", {
      aliases: ["tier-list", "tl"],
      category: "Tier",
      channelRestriction: "guild",
      description: {
        content: "List the glorious tiers",
        examples: ["tier-list"]
      },
      options: {
        permissions: checkManagePermissions
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      let tiers = await Tier.findAll({
        where: { guild },
        order: [["weight", "DESC"]]
      });

      if (tiers.length === 0) {
        return msg.channel.send("No tiers found");
      }

      let totalOdds = 0;
      let totalLucky = 0;
      let message = "";

      tiers.forEach(reward => {
        totalOdds += reward.weight;
        totalLucky += reward.luckyWeight;
      });

      tiers.forEach(tier => {
        message += `
__**${tier.name}**__
Color: #${tier.color.toString(16)}
Image: <${tier.image}>
Weight: ${formatOdd(tier.weight, totalOdds)}
Lucky Weight: ${formatOdd(tier.luckyWeight, totalLucky)}
`;
      });

      return msg.channel.send(message);
    } catch (error) {
      return msg.channel.send("An error occurred listing tiers");
    }
  }
};
