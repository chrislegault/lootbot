const { Inhibitor } = require("discord-akairo");
const { hasPermission } = require("../support");

class PermissionsInhibitor extends Inhibitor {
  constructor() {
    super("permissions", {
      reason: "permissions"
    });
  }

  exec(msg, command) {
    try {
      const permitted = hasPermission(msg, command);

      if (permitted) {
        return Promise.resolve();
      }

      return Promise.reject();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = PermissionsInhibitor;
