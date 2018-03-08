const MANAGE = "manage";

module.exports = msg => {
  try {
    let permissions = msg.client.settings.get(msg.guild.id, "permissions", {});

    if (permissions[MANAGE]) {
      const matchingRole = permissions[MANAGE].find(permittedRole =>
        msg.member.roles.has(permittedRole)
      );

      return !!matchingRole;
    }

    return false;
  } catch (error) {
    return false;
  }
};
