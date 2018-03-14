module.exports = function hasPermissions(msg, command) {
  // Bot owner can run every command
  const isAdmin =
    msg.guild && msg.channel.permissionsFor(msg.author).has(["ADMINISTRATOR"]);

  if (msg.client.ownerID === msg.author.id || isAdmin) {
    return true;
  }

  try {
    const permissions = command.options.permissions;

    if (permissions) {
      if (typeof permissions === "function") {
        return permissions(msg);
      } else if (msg.guild) {
        return msg.channel.permissionsFor(msg.author).has(permissions);
      }
    }

    return true;
  } catch (error) {
    return false;
  }
};
