const { Command } = require("discord.js-commando");
const { Message } = require("../../models");

module.exports = class MessageList extends Command {
  constructor(client) {
    super(client, {
      name: "message:list",
      group: "message",
      memberName: "list",
      description: "List the glorious messages",
      examples: ["tier:list"]
    });
  }

  async run(msg) {
    const guild = msg.guild.id;

    let messages = await Message.findAll({
      where: { guild }
    });

    if (messages.length === 0) {
      return msg.say("No messages found.");
    }

    let list = "";

    messages.forEach(message => {
      list += `__**${message.name}**__\n`;
      list += `Message: ${message.message}\n`;
      list += `Type: ${message.type}\n`;
      list += `Tier: ${message.tier_id}\n`;
      list += `User: ${message.user}\n\n`;
    });

    return msg.say(list);
  }
};
