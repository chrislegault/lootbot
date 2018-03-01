const { Command } = require("discord.js-commando");
const { Tier } = require("../../models");

module.exports = class TierUpdate extends Command {
  constructor(client) {
    super(client, {
      name: "tier:update",
      group: "tier",
      memberName: "update",
      description: "Update that tier",
      examples: [
        `update Common 25 75 Legendary "New Maple Syrup"`,
        `update "Maple Syrup" 25 75 Uncommon`
      ],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "existingName",
          prompt: "What is the current name of the tier?",
          type: "string"
        },
        {
          key: "weight",
          prompt: "What is the new weight of the tier?",
          type: "float",
          default: ""
        },
        {
          key: "luckyWeight",
          prompt: "What is the new lucky weight of the tier?",
          type: "float",
          default: ""
        },
        {
          key: "color",
          prompt: "What is the new color of the tier?",
          type: "string",
          default: ""
        },
        {
          key: "image",
          prompt: "What is the new image of the tier?",
          type: "string",
          default: ""
        },
        {
          key: "name",
          prompt: "What is the new name of the loot?",
          type: "string",
          default: ""
        }
      ]
    });
  }

  async run(msg, newValues) {
    const guild = msg.guild.id;
    let updates = {};
    let name = newValues.existingName;

    Object.keys(newValues).forEach(key => {
      if (newValues[key] && key !== "existingName") {
        updates[key] = newValues[key];
      }
    });

    try {
      const [updated] = await Tier.update(updates, {
        where: { name, guild }
      });

      if (updated === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${newValues.name || name} updated`);
      }
    } catch (e) {
      msg.say(`An error occurred updating ${name}`);
    }
  }
};
