const chance = require("chance")();
const { Command } = require("discord-akairo");
const { Tier } = require("../../models");
const { checkManagePermissions } = require("../../support");

function times(count, fn) {
  for (let i = 0; i < count; i++) {
    fn(i, count);
  }
}

module.exports = class LootAdd extends Command {
  constructor() {
    super("simulate", {
      aliases: ["simulate"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        description: "Simulate opening a lootbox",
        examples: ["simulate", "simulate 10000"],
        usage: "<draws>"
      },
      options: {
        permissions: checkManagePermissions
      },
      args: [
        {
          id: "draws",
          prompt: {
            retry: "How many draws to simulate?",
            optional: true
          },
          type: "integer",
          default: 1000
        },
        {
          id: "lucky",
          match: "flag",
          prefix: "lucky",
          default: false
        }
      ]
    });
  }

  async exec(msg, { draws, lucky }) {
    const guild = msg.guild.id;

    try {
      const tiers = await Tier.findAll({
        where: { guild }
      });

      if (tiers.length === 0) {
        return msg.channel.send("No tiers found");
      }

      let results = {};
      let message = "";

      const weights = tiers.map(
        tier => (lucky ? tier.luckyWeight : tier.weight)
      );

      times(draws, () => {
        const tier = chance.weighted(tiers, weights);

        if (!results[tier.name]) {
          results[tier.name] = 0;
        }

        results[tier.name] += 1;
      });

      Object.keys(results).forEach(key => {
        message += `${key}: ${results[key]}\n`;
      });

      return msg.channel.send(message);
    } catch (error) {
      return msg.channel.send(`An error occurred simulating`);
    }
  }
};
