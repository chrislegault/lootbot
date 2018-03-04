const { Command } = require("discord-akairo");
const { Tier, Message } = require("../../models");

module.exports = class MessageAdd extends Command {
  constructor() {
    super("message-add", {
      aliases: ["message-add", "ma"],
      category: "Message",
      channelRestriction: "guild",
      description: {
        content:
          "Add message to the lootbox. Messages can be targeted at specific users. Messages can also be targeted at specific tiers of loot (draw and reward types only)",
        examples: [
          `message-add basicintro "Some intro..." intro`,
          `message-add basicdraw "You won a prize!" draw`,
          `message-add drawtier "<tier> prize...womp womp" draw tier=Common`,
          `message-add drawtierdelay "<tier> prize...womp womp. Waiting..." draw delay=10 tier=Common`,
          `message-add drawtieruser "Specific user, you have won a <tier> prize...womp womp" draw tier=Common user=@user`,
          `message-add basicreward "Congrats <user>, you won loot named <reward>" reward`,
          `message-add rewardtier "Congrats on your amazing prize" reward tier=Legendary`,
          `message-add rewardtieruser "Specific user, congrats" reward user=@user`
        ],
        usage: "<name> <message> <type> delay=<delay> tier=<tier> user=<user>"
      },
      split: "sticky",
      userPermissions: ["MANAGE_CHANNELS"],
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
          prompt: { start: "What is the message?" },
          type: "string"
        },
        {
          id: "type",
          prompt: {
            start: "What is the type of the message? (intro, draw, or reward)"
          },
          type: "string",
          validate: type => ["intro", "draw", "reward"].includes(type)
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

  async exec(msg, { tier, user, ...fields }) {
    const guild = msg.guild.id;

    fields = Object.keys(fields).reduce((memo, key) => {
      if (fields[key] !== null) {
        memo[key] = fields[key];
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

        fields.tier_id = foundTier.id;
      }

      if (user) {
        fields.user_id = user.id;
      }

      const [, added] = await Message.findOrCreate({
        where: { name: fields.name, guild },
        defaults: { ...fields, guild }
      });

      if (added) {
        return msg.channel.send(`${fields.name} added.`);
      }

      return msg.channel.send(`${fields.name} already exists.`);
    } catch (error) {
      return msg.channel.send(`An error occurred adding ${fields.name}`);
    }
  }
};
