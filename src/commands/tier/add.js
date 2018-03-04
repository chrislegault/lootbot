const { Command } = require("discord-akairo");
const { Tier } = require("../../models");

module.exports = class TierAdd extends Command {
  constructor() {
    super("tier-add", {
      aliases: ["tier-add", "ta"],
      category: "Tier",
      channelRestriction: "guild",
      description: {
        content: "Add tier to the lootbox",
        examples: [
          "tier:add Common #123456 https://some.pathtoimage.png 25 75"
        ],
        usage: "<name> <color> <image> <weight> <luckyWeight>"
      },
      options: {
        permissions: ["MANAGE_CHANNELS"]
      },
      split: "quoted",
      args: [
        {
          id: "name",
          prompt: {
            start: "What is the name of the tier?"
          },
          type: "string"
        },
        {
          id: "color",
          prompt: {
            start: "What is the color of the tier?"
          },
          type: "color"
        },
        {
          id: "image",
          prompt: {
            start: "What is the image of the tier?"
          },
          type: "url"
        },
        {
          id: "weight",
          prompt: {
            start: "What is the weight of the loot?"
          },
          type: "number"
        },
        {
          id: "luckyWeight",
          prompt: {
            start: "What is the lucky weight of the loot?"
          },
          type: "number"
        }
      ]
    });
  }

  async exec(msg, { name, color, image, weight, luckyWeight }) {
    const guild = msg.guild.id;

    try {
      const [, added] = await Tier.findOrCreate({
        where: { name, guild },
        defaults: { name, image: image.href, color, weight, luckyWeight, guild }
      });

      if (added) {
        return msg.channel.send(`Tier ${name} added.`);
      } else {
        return msg.channel.send(`Tier ${name} already exists.`);
      }
    } catch (error) {
      return msg.channel.send(`An error occurred adding Tier ${name}`);
    }
  }
};
