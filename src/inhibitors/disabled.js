const { Inhibitor } = require("discord-akairo");

class DisabledInhibitor extends Inhibitor {
  constructor() {
    super("disabled", {
      reason: "disabled"
    });
  }

  exec(msg, command) {
    const isAdmin =
      msg.guild &&
      msg.channel.permissionsFor(msg.author).has(["ADMINISTRATOR"]);

    if (msg.client.ownerID === msg.author.id || isAdmin) {
      return Promise.resolve();
    }

    // move onto next inhibitor (permission checks)
    if (command.id === "enable") {
      return Promise.resolve();
    }

    const guild = msg.guild.id;
    const disabled = msg.client.settings.get(guild, "disabled", false);
    return disabled ? Promise.reject() : Promise.resolve();
  }
}

module.exports = DisabledInhibitor;
