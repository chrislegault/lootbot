const { Command } = require("discord-akairo");

module.exports = class PermissionsAdd extends Command {
  constructor() {
    super("permissions-remove", {
      aliases: ["permissions-remove", "pr"],
      category: "Permissions",
      channelRestriction: "guild",
      description: {
        content: "Remove role from lootbot",
        examples: [`permissions-remove manage "Loot Manager"`],
        usage: "<permission> <role>"
      },
      options: {
        permissions: ["MANAGE_CHANNELS"]
      },
      split: "quoted",
      args: [
        {
          id: "permission",
          prompt: {
            start: "What is the name of the permission? (manage)"
          },
          type: "string"
        },
        {
          id: "role",
          prompt: {
            start: "What is the role to remove from permission?"
          },
          type: "role"
        }
      ]
    });
  }

  async exec(msg, { permission, role }) {
    const guild = msg.guild.id;

    try {
      let permissions = await msg.client.settings.get(guild, "permissions", {});

      if (
        permissions[permission] &&
        permissions[permission].includes(role.id)
      ) {
        permissions[permission].splice(
          permissions[permission].indexOf(role.id, 1)
        );
        await msg.client.settings.set(guild, "permissions", permissions);
      }

      return msg.channel.send("Permissions updated");
    } catch (error) {
      return msg.channel.send(`An error occurred updating permissions`);
    }
  }
};
