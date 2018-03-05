const { Command } = require("discord-akairo");
const { Message } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class MessageRemove extends Command {
  constructor() {
    super("message-remove", {
      aliases: ["message-remove", "mr"],
      category: "Message",
      channelRestriction: "guild",
      description: {
        description: "Remove a message",
        examples: [`message:remove msg1`]
      },
      options: {
        permissions: checkManagePermissions
      },
      args: [
        {
          id: "name",
          prompt: {
            prompt: "What is the name of the message?"
          },
          type: "string"
        }
      ]
    });
  }

  async exec(msg, { name }) {
    const guild = msg.guild.id;

    try {
      const result = await Message.destroy({
        where: { name, guild }
      });

      if (result === 0) {
        return msg.channel.send(`${name} not found`);
      } else {
        return msg.channel.send(`${name} removed`);
      }
    } catch (e) {
      return msg.channel.send(`An error occurred removing ${name}`);
    }
  }
};
