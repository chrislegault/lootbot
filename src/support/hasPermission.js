module.exports = function hasPermissions(msg, command) {
  // Bot owner can run every command
  if (msg.client.ownerID === msg.author.id) {
    return true;
  }

  try {
    const permissions = command.options.permissions;

    if (permissions) {
      if (typeof permissions === "function") {
        return permissions(msg);
      } else if (
        msg.guild &&
        !msg.channel.permissionsFor(msg.author).has(permissions)
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
