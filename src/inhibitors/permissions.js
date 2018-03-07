const { Inhibitor } = require("discord-akairo");

class PermissionsInhibitor extends Inhibitor {
  constructor() {
    super("permissions", {
      reason: "permissions"
    });
  }

  async exec(msg, command) {
    // Bot owner can run every command
    if (msg.client.ownerID === msg.author.id) {
      return Promise.resolve();
    }

    try {
      const permissions = command.options.permissions;

      if (permissions) {
        if (typeof permissions === "function") {
          const permitted = await permissions(msg);

          if (!permitted) {
            return Promise.reject();
          }
        } else if (
          msg.guild &&
          !msg.channel.permissionsFor(msg.author).has(permissions)
        ) {
          return Promise.reject();
        }
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = PermissionsInhibitor;
