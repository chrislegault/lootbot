const { Command } = require("discord-akairo");
const { Loot, Tier } = require("../../models");

module.exports = class LootList extends Command {
  constructor() {
    super("loot-list", {
      aliases: ["loot-list", "ll"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        content: "List the glorious loot",
        examples: ["loot-list"]
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      let tiers = await Tier.findAll({
        include: [{ model: Loot }],
        where: { guild },
        order: [["weight", "DESC"], ["Loots", "name", "ASC"]]
      });

      if (tiers.length === 0) {
        return msg.channel.send("No loot found.");
      }

      let message = "";

      tiers.forEach(tier => {
        message += `__**${tier.name}**__\n`;

        if (tier.Loots.length === 0) {
          message += "N/A\n";
        }

        tier.Loots.forEach(loot => {
          message += `${loot.name}\n`;
        });

        message += "\n";
      });

      return msg.channel.send(message);
    } catch (error) {
      return msg.channel.send("An error occurred listing loot.");
    }
  }
};
