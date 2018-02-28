const { Command } = require("discord.js-commando");
const { Tier } = require("../../models");

module.exports = class TierAdd extends Command {
  constructor(client) {
    super(client, {
      name: "tier:add",
      group: "tier",
      memberName: "tier:add",
      description: "Add tier to the lootbox",
      examples: ["tier:add Common #123456 pathtoimage.png 25 75"],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the name of the tier?",
          type: "string"
        },
        {
          key: "color",
          prompt: "What is the color of the tier?",
          type: "string"
        },
        {
          key: "image",
          prompt: "What is the image of the tier?",
          type: "string"
        },
        {
          key: "weight",
          prompt: "What is the weight of the loot?",
          type: "float"
        },
        {
          key: "luckyWeight",
          prompt: "What is the lucky weight of the loot?",
          type: "float"
        }
      ]
    });
  }

  async run(msg, args) {
    const guild = msg.guild.id;
    const { name } = args;

    try {
      const [, added] = await Tier.findOrCreate({
        where: { name, guild },
        defaults: { ...args, guild }
      });

      if (added) {
        msg.say(`Tier ${name} added.`);
      } else {
        msg.say(`Tier ${name} already exists.`);
      }
    } catch (error) {
      msg.say(`An error occurred adding Tier ${name}`);
    }
  }
};
