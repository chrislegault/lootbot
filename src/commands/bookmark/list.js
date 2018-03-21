const { Command } = require("discord-akairo");
const { Bookmark } = require("../../models");
const { checkManagePermissions } = require("../../support");
const logger = require("../../logger");

module.exports = class BookmarkList extends Command {
  constructor() {
    super("bookmark-list", {
      aliases: ["bookmark-list", "bl"],
      category: "Bookmark",
      channelRestriction: "guild",
      description: {
        content: "List the tracked bookmark roles",
        examples: ["bookmark-list"]
      },
      options: {
        permissions: checkManagePermissions
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      let bookmarks = await Bookmark.findAll({
        where: { guild }
      });

      if (bookmarks.length === 0) {
        return msg.channel.send("No bookmarks found");
      }

      let list = "";

      bookmarks.forEach(bookmark => {
        list += `<@&${bookmark.role}>: ${bookmark.weight}\n`;
      });

      return msg.channel.send(list);
    } catch (error) {
      logger.error(error.message);
      return msg.channel.send("An error occurred listing bookmarks");
    }
  }
};
