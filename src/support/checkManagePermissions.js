const MANAGE = "manage";

module.exports = async function checkManagePermissions(msg) {
  try {
    let permissions = await msg.client.settings.get(
      msg.guild.id,
      "permissions",
      {}
    );

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
