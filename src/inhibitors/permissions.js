const { Inhibitor } = require("discord-akairo");

class PermissionsInhibitor extends Inhibitor {
  constructor() {
    super("permissions", {
      reason: "permissions"
    });
  }

  async exec(message, command) {
    // Bot owner can run every command
    if (message.client.ownerID === message.author.id) {
      return Promise.resolve();
    }

    const permissions = command.options.permissions;

    if (permissions) {
      if (typeof permissions === "function") {
        const permitted = await permissions(message);

        if (!permitted) {
          return Promise.reject();
        }
      } else if (
        message.guild &&
        !message.channel.permissionsFor(message.author).has(permissions)
      ) {
        return Promise.reject();
      }
    }

    return Promise.resolve();
  }
}

module.exports = PermissionsInhibitor;
