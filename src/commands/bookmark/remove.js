const { Command } = require("discord-akairo");
const { Bookmark } = require("../../models");
const { checkManagePermissions } = require("../../support");
const logger = require("../../logger");

module.exports = class BookmarkRemove extends Command {
  constructor() {
    super("bookmark-remove", {
      aliases: ["bookmark-remove", "br"],
      category: "Bookmark",
      channelRestriction: "guild",
      description: {
        content: "Remove bookmark tracking from a role",
        examples: [`bookmark-remove "Some Role"`],
        usage: "<role>"
      },
      options: {
        permissions: checkManagePermissions
      },
      split: "quoted",
      args: [
        {
          id: "role",
          prompt: {
            start: "What is the role to stop tracking?"
          },
          type: "role"
        }
      ]
    });
  }

  async exec(msg, { role }) {
    const guild = msg.guild.id;

    try {
      const result = await Bookmark.destroy({
        where: { role: role.id, guild }
      });

      if (result === 0) {
        return msg.channel.send(`${role.name} not found`);
      }

      return msg.channel.send(`${role.name} tracking stopped`);
    } catch (error) {
      logger.error(error.message);
      return msg.channel.send(`An error occurred removing ${role.name}`);
    }
  }
};
