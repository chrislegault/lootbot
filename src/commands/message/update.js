const { Command } = require("discord-akairo");
const { Tier, Message } = require("../../models");
const { checkManagePermissions } = require("../../support");

module.exports = class MessageUpdate extends Command {
  constructor() {
    super("message-update", {
      aliases: ["message-update", "mu"],
      category: "Message",
      channelRestriction: "guild",
      description: {
        content: "Update message in the lootbox",
        examples: [
          `message-update msg1 message="New exciting message"`,
          `message-update msg1 type=draw`,
          `message-update msg1 delay=10 tier=Common`,
          `message-update msg1 message="You have won a <tier> prize..." user=@user`
        ],
        usage:
          "<name> message=<message> type=<type> delay=<delay> tier=<tier> user=<user>"
      },
      options: {
        permissions: checkManagePermissions
      },
      split: "sticky",
      args: [
        {
          id: "name",
          prompt: {
            start: "What is the identier of the message?"
          },
          type: "string"
        },
        {
          id: "message",
          prompt: {
            start: "What is the message?",
            optional: true
          },
          match: "prefix",
          prefix: "message=",
          type: "string",
          default: null
        },
        {
          id: "type",
          prompt: {
            start: "What is the type of the message? (intro, draw, or reward)",
            optional: true
          },
          match: "prefix",
          prefix: "type=",
          type: "string",
          validate: type => ["intro", "draw", "reward"].includes(type),
          default: null
        },
        {
          id: "delay",
          prompt: {
            start: "What is the delay until the next message is shown?",
            optional: true
          },
          match: "prefix",
          prefix: "delay=",
          type: "integer",
          default: null
        },
        {
          id: "tier",
          prompt: {
            start:
              "What is the tier of the loot? (blank will be included in all tiers of loot)",
            optional: true
          },
          match: "prefix",
          prefix: "tier=",
          type: "string",
          default: null
        },
        {
          id: "user",
          prompt: {
            start:
              "What user should receive this message? (blank will be all users)",
            optional: true
          },
          match: "prefix",
          prefix: "user=",
          type: "member",
          default: null
        }
      ]
    });
  }

  async exec(msg, { name, user, tier, ...updates }) {
    const guild = msg.guild.id;

    updates = Object.keys(updates).reduce((memo, key) => {
      if (updates[key] !== null) {
        memo[key] = updates[key];
      }

      return memo;
    }, {});

    try {
      if (tier) {
        let foundTier = null;

        foundTier = await Tier.findOne({
          where: { name: tier, guild }
        });

        if (!foundTier) {
          return msg.channel.send("A valid tier must be provided.");
        }

        updates = { ...updates, tier_id: foundTier.id };
      }

      if (user) {
        updates = { ...updates, user_id: user.id };
      }

      const [updated] = await Message.update(updates, {
        where: { name, guild }
      });

      if (updated === 0) {
        return msg.channel.send(`${name} not found`);
      }

      return msg.channel.send(`${name} updated`);
    } catch (e) {
      return msg.channel.send(`An error occurred updating ${name}`);
    }
  }
};
