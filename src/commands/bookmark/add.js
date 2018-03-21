const { Command } = require("discord-akairo");
const { Bookmark } = require("../../models");
const { checkManagePermissions } = require("../../support");
const logger = require("../../logger");

module.exports = class BookmarkAdd extends Command {
  constructor() {
    super("bookmark-add", {
      aliases: ["bookmark-add", "ba"],
      category: "Bookmark",
      channelRestriction: "guild",
      description: {
        content: "Add bookmark tracking for a role",
        examples: [
          `bookmark-add "Some Role"`,
          `bookmark-add "Another Role" weight=3`
        ],
        usage: "<role> weight=<weight>"
      },
      split: "quoted",
      options: {
        permissions: checkManagePermissions
      },
      args: [
        {
          id: "role",
          prompt: {
            start: "What role should be tracked for bookmarks?"
          },
          type: "role"
        },
        {
          id: "weight",
          prompt: {
            start: "What is the weight of the bookmark?",
            optional: true
          },
          match: "prefix",
          prefix: "weight=",
          type: "number",
          default: 1
        }
      ]
    });
  }

  async exec(msg, { role, weight }) {
    const guild = msg.guild.id;

    try {
      const [, added] = await Bookmark.findOrCreate({
        where: { role: role.id, guild },
        defaults: { role: role.id, guild, weight }
      });

      if (added) {
        return msg.channel.send(`${role.name} tracked`);
      } else {
        return msg.channel.send(`${role.name} already tracked`);
      }
    } catch (error) {
      logger.error(error.message);
      return msg.channel.send(`An error occurred tracking ${role.name}`);
    }
  }
};
