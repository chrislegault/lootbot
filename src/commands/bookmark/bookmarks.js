const { Command } = require("discord-akairo");
const { Bookmark } = require("../../models");
const logger = require("../../logger");

module.exports = class BookmarkBookmarks extends Command {
  constructor() {
    super("bookmarks", {
      aliases: ["bookmarks"],
      category: "Bookmark",
      channelRestriction: "guild",
      description: {
        content: "Check the amount of bookmarks you have",
        examples: ["bookmarks"]
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;
    const { member: { roles } } = msg;

    try {
      let bookmarkRoles = await Bookmark.findAll({
        where: { guild }
      });

      const bookmarks = bookmarkRoles
        .filter(bookmark => roles.has(bookmark.role))
        .reduce((memo, bookmark) => memo + bookmark.weight, 0);

      const label = bookmarks === 1 ? "bookmark" : "bookmarks";

      return msg.channel.send(`You have ${bookmarks} ${label}`);
    } catch (error) {
      logger.error(error.message);
      return msg.channel.send("An error occurred listing bookmarks");
    }
  }
};
