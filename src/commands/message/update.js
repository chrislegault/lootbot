const { Command } = require("discord.js-commando");
const { Tier, Message } = require("../../models");

module.exports = class MessageUpdate extends Command {
  constructor(client) {
    super(client, {
      name: "message:update",
      group: "message",
      memberName: "update",
      description: "Update message in the lootbox",
      examples: [
        `message:update msg1 "New exciting message"`,
        `message:update msg1 "Drawing loot..." draw`,
        `message:update msg1 "You have won a <tier> prize..." tier 10 Common`,
        `message:update msg1 "You have won a <tier> prize..." tier "" Common`,
        `message:update msg1 "You have won a <tier> prize..." tier "" Common @user`,
        `message:update msg1 "Congrats <user>, you won loot named <reward>" reward`
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
          type: "string",
          default: ""
        },
        {
          key: "type",
          prompt: "What is the type of the message? (draw, tier, or reward)",
          type: "string",
          default: "",
          validate: type => ["draw", "tier", "reward"].includes(type)
        },
        {
          key: "delay",
          prompt: "What is the delay until the next message is shown?",
          type: "integer",
          default: ""
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
    let updates = {};

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

      updates = { ...updates, tier_id: foundTier.id };
    }

    if (message) {
      updates = { ...updates, message };
    }

    if (type) {
      updates = { ...updates, type };
    }

    if (user) {
      updates = { ...updates, user: user.id };
    }

    if (Number.isInteger(delay)) {
      updates = { ...updates, delay };
    }

    try {
      const [updated] = await Message.update(updates, {
        where: { name, guild }
      });

      if (updated === 0) {
        msg.say(`${name} not found`);
      } else {
        msg.say(`${name} updated`);
      }
    } catch (e) {
      msg.say(`An error occurred updating ${name}`);
    }
  }
};
