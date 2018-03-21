const { Command } = require("discord-akairo");
const { TrackedRole } = require("../../models");
const { checkManagePermissions } = require("../../support");
const logger = require("../../logger");

module.exports = class TrackedList extends Command {
  constructor() {
    super("track-list", {
      aliases: ["track-list", "trl"],
      category: "Bookmark",
      channelRestriction: "guild",
      description: {
        content: "List the tracked bookmark roles",
        examples: ["track-list"]
      },
      options: {
        permissions: checkManagePermissions
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      let trackedRoles = await TrackedRole.findAll({
        where: { guild }
      });

      if (trackedRoles.length === 0) {
        return msg.channel.send("No tracked roles found");
      }

      let list = "";

      trackedRoles.forEach(trackedRole => {
        list += `<@&${trackedRole.role}>: ${trackedRole.weight}\n`;
      });

      return msg.channel.send(list);
    } catch (error) {
      logger.error(error.message);
      return msg.channel.send("An error occurred listing tracked roles");
    }
  }
};
