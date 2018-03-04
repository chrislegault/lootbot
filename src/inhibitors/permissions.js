const { Inhibitor } = require("discord-akairo");

class PermissionsInhibitor extends Inhibitor {
  constructor() {
    super("permissions", {
      reason: "permissions"
    });
  }

  exec(message, command) {
    // Bot owner can run every command
    if (message.client.ownerID === message.author.id) {
      return false;
    }

    let permissions = command.options.permissions;

    if (typeof permissions === "function") {
      if (!permissions(message)) {
        return true;
      }
    } else if (
      message.guild &&
      !message.channel.permissionsFor(message.author).has(permissions)
    ) {
      return true;
    }

    return false;
  }
}

module.exports = PermissionsInhibitor;
