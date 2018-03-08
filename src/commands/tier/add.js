const { Command } = require("discord-akairo");
const { Tier } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class TierAdd extends Command {
  constructor() {
    super("tier-add", {
      aliases: ["tier-add", "ta"],
      category: "Tier",
      channelRestriction: "guild",
      description: {
        content: "Add tier to the lootbox",
        examples: [
          "tier-add Common #123456 https://some.pathtoimage.png 25 75"
        ],
        usage: "<name> <color> <image> <weight> <luckyWeight>"
      },
      options: {
        permissions: checkManagePermissions
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

  async exec(msg, { image, ...args }) {
    const guild = msg.guild.id;
    args = { ...args, image: image.href, guild };

    try {
      const [, added] = await Tier.findOrCreate({
        where: { name: args.name, guild },
        defaults: args
      });

      if (added) {
        return msg.channel.send(`${args.name} added`);
      } else {
        return msg.channel.send(`${args.name} already exists`);
      }
    } catch (error) {
      return msg.channel.send(`An error occurred adding ${args.name}`);
    }
  }
};
