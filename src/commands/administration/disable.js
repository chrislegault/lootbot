const { Command } = require("discord-akairo");

module.exports = class LootAdd extends Command {
  constructor() {
    super("disable", {
      aliases: ["disable"],
      category: "Administration",
      channelRestriction: "guild",
      description: {
        description: "Disable all commands",
        examples: ["disable"]
      },
      options: {
        permissions: ["ADMINISTRATOR"]
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      await msg.client.settings.set(guild, "disabled", true);
      return msg.channel.send(`<@${msg.client.user.id}> disabled`);
    } catch (error) {
      return msg.channel.send(
        `An error occurred disabling <@${msg.client.user.id}>`
      );
    }
  }
};
