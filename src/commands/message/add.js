const { Command } = require("discord.js-commando");
const { Tier, Message } = require("../../models");

module.exports = class MessageAdd extends Command {
  constructor(client) {
    super(client, {
      name: "message:add",
      group: "message",
      memberName: "add",
      description: "Add message to the lootbox",
      examples: [
        `message:add msg1 "Drawing loot..." draw`,
        `message:add msg1 "You have won a <tier> prize..." tier 10 Common`,
        `message:add msg1 "You have won a <tier> prize..." tier "" Common`,
        `message:add msg1 "You have won a <tier> prize..." tier "" Common @user`,
        `message:add msg1 "Congrats <user>, you won loot named <reward>" reward`
      ],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "name",
          prompt: "What is the identier of the message?",
          type: "string"
        },
        {
          key: "message",
          prompt: "What is the message?",
          type: "string"
        },
        {
          key: "type",
          prompt: "What is the type of the message? (draw, tier, or reward)",
          type: "string",
          validate: type => ["draw", "tier", "reward"].includes(type)
        },
        {
          key: "delay",
          prompt: "What is the delay until the next message is shown?",
          type: "integer",
          default: 0
        },
        {
          key: "tier",
          prompt:
            "What is the tier of the loot? (required if type is tier, blank if not needed)",
          type: "string",
          default: ""
        },
        {
          key: "user",
          prompt: "What user should receive this message? (blank if all users)",
          type: "user",
          default: ""
        }
      ]
    });
  }

  async run(msg, { name, message, type, tier, user, delay }) {
    const guild = msg.guild.id;
    let foundTier = null;

    if (type === "tier") {
      if (!tier) {
        return msg.say("A tier must be provided when the type is set to tier.");
      }

      foundTier = await Tier.findOne({
        where: { name: tier, guild }
      });

      if (!foundTier) {
        return msg.say(
          "A valid tier must be provided when the type is set to tier."
        );
      }
    }

    const [, added] = await Message.findOrCreate({
      where: { name, guild },
      defaults: {
        name,
        message,
        type: type,
        tier_id: foundTier ? foundTier.id : null,
        user: user ? user.id : null,
        guild,
        delay
      }
    });

    if (added) {
      msg.say(`${name} added.`);
    } else {
      msg.say(`${name} already exists.`);
    }
  }
};
