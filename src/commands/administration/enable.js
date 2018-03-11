const { Command } = require("discord-akairo");

module.exports = class LootAdd extends Command {
  constructor() {
    super("enable", {
      aliases: ["enable"],
      category: "Administration",
      channelRestriction: "guild",
      description: {
        content: "Enable all commands",
        examples: ["enable"]
      },
      options: {
        permissions: ["ADMINISTRATOR"]
      }
    });
  }

  async exec(msg) {
    const guild = msg.guild.id;

    try {
      await msg.client.settings.set(guild, "disabled", false);
      return msg.channel.send(`<@${msg.client.user.id}> enabled`);
    } catch (error) {
      return msg.channel.send(
        `An error occurred enabling <@${msg.client.user.id}>`
      );
    }
  }
};
