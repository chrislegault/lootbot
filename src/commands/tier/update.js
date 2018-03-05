const { Command } = require("discord-akairo");
const { Tier } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class TierUpdate extends Command {
  constructor() {
    super("tier-update", {
      aliases: ["tier-update", "tu"],
      category: "Tier",
      channelRestriction: "guild",
      description: {
        content: "Update that tier",
        examples: [
          `tier-update Common name="New Common" color=#555555 image=https://some.pathtoimage.png weight=25 luckyWeight=75`,
          `tier-update "Super Common" weight=10`
        ],
        usage:
          "<existingName> name=<name> color=<color> image=<image> weight=<weight> luckyWeight=<luckyWeight>"
      },
      options: {
        permissions: checkManagePermissions
      },
      split: "sticky",
      args: [
        {
          id: "existingName",
          prompt: { start: "What is the current name of the tier?" },
          type: "string"
        },
        {
          id: "name",
          prompt: {
            start: "What is the new name of the tier?",
            optional: true
          },
          match: "prefix",
          prefix: "name=",
          type: "string",
          default: null
        },
        {
          id: "color",
          prompt: {
            start: "What is the new color of the tier?",
            optional: true
          },
          match: "prefix",
          prefix: "color=",
          type: "color",
          default: null
        },
        {
          id: "image",
          prompt: {
            start: "What is the new image of the tier?",
            optional: true
          },
          match: "prefix",
          prefix: "image=",
          type: "url",
          default: null
        },
        {
          id: "weight",
          prompt: {
            start: "What is the new weight of the tier?",
            optional: true
          },
          match: "prefix",
          prefix: "weight=",
          type: "number",
          default: null
        },
        {
          id: "luckyWeight",
          prompt: {
            start: "What is the new lucky weight of the tier?",
            optional: true
          },
          match: "prefix",
          prefix: "luckyWeight=",
          type: "number",
          default: null
        }
      ]
    });
  }

  async exec(msg, { existingName, ...updates }) {
    const guild = msg.guild.id;

    updates = Object.keys(updates).reduce((memo, key) => {
      if (updates[key] !== null) {
        memo[key] = updates[key];
      }

      return memo;
    }, {});

    if (updates.image) {
      updates.image = updates.image.href;
    }

    try {
      const [updated] = await Tier.update(updates, {
        where: { name: existingName, guild }
      });

      if (updated === 0) {
        return msg.channel.send(`${existingName} not found`);
      } else {
        return msg.channel.send(`${updates.name || existingName} updated`);
      }
    } catch (e) {
      return msg.channel.send(`An error occurred updating ${existingName}`);
    }
  }
};
