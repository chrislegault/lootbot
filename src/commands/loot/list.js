const { Command } = require("discord.js-commando");
const { Loot, Tier } = require("../../models");

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "loot:list",
      group: "loot",
      memberName: "loot:list",
      description: "List the glorious loot",
      examples: ["loot:list"]
    });
  }

  async run(msg) {
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
    });

    return msg.say(message);
  }
};
