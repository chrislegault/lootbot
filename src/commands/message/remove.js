const { Command } = require("discord.js-commando");
const { Message } = require("../../models");

module.exports = class MessageRemove extends Command {
  constructor(client) {
    super(client, {
      name: "message:remove",
      group: "message",
      memberName: "remove",
      description: "Remove a message",
      examples: [`message:remove msg1`],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the name of the message?",
          type: "string"
        }
      ]
    });
  }

  async run(msg, { name }) {
    const guild = msg.guild.id;

    try {
      const result = await Message.destroy({
        where: { name, guild }
      });

      if (result === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${name} removed`);
      }
    } catch (e) {
      msg.say(`An error occurred removing ${name}`);
    }
  }
};
