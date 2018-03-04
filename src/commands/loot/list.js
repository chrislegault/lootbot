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

    let tiers = await Tier.findAll({
      include: [
        {
          model: Loot
        }
      ],
      where: { guild },
      order: [["weight", "DESC"], ["Loots", "name", "ASC"]]
    });

    let message = "";

    tiers.forEach(tier => {
      message += `__**${tier.name}**__\n`;

      tier.Loots.forEach(loot => {
        message += `${loot.name}\n`;
      });

      message += "\n";
    });

    return msg.channel.send(message);
  }
};
