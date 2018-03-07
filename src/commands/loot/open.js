const chance = require("chance")();
const { RichEmbed } = require("discord.js");
const { Command } = require("discord-akairo");
const { Loot, Tier, Message } = require("../../models");

const {
  delay,
  formatMessage,
  checkManagePermissions
} = require("../../support");

function sayMessage(message, msg, reward, user, tier) {
  return msg.channel.send(formatMessage(message, reward, user, tier));
}

function sayReward(message, msg, reward, user, tier) {
  var embed = new RichEmbed()
    .setColor(tier.color)
    .setDescription(formatMessage(message, reward, user, tier))
    .setImage(tier.image);

  return msg.channel.send({ embed });
}

function randomMessage(messages, filter, defaultMessage) {
  let filtered = messages.filter(message => filter(message));

  if (filtered.length === 0) {
    filtered = [defaultMessage];
  }

  return chance.pickone(filtered);
}

const DEFAULT_MESSAGES = {
  intro: {
    message: "Drawing loot...",
    delay: 0
  },
  draw: {
    message: "<tier> prize won...",
    delay: 1000
  },
  reward: {
    message: "Congratulations <user>, you won <reward>",
    delay: 0
  }
};

module.exports = class LootOpen extends Command {
  constructor() {
    super("open", {
      aliases: ["open", "loot-open"],
      category: "Loot",
      channelRestriction: "guild",
      description: {
        content: "Opens a lootbox",
        examples: ["open", "loot-open"]
      },
      options: {
        permissions: checkManagePermissions
      },
      args: [
        {
          id: "user",
          prompt: {
            start: "Which user would you like to open a lootbox for?"
          },
          type: "member"
        },
        {
          id: "lucky",
          match: "flag",
          prefix: "lucky",
          default: false
        }
      ]
    });
  }

  async exec(msg, { user, lucky }) {
    const guild = msg.guild.id;

    const tiers = await Tier.findAll({
      include: [
        {
          model: Loot
        }
      ],
      where: { guild }
    });

    if (tiers.filter(tier => tier.Loots.length > 0).length === 0) {
      return msg.channel.send("No loot in the lootbox");
    }

    const weights = tiers.map(tier => (lucky ? tier.luckyWeight : tier.weight));
    const tier = chance.weighted(tiers, weights);

    if (tier.Loots.length === 0) {
      return msg.channel.send(
        `${tier.name} loot won, but no prizes are registered`
      );
    }

    const reward = chance.pickone(tier.Loots);

    const myMessages = await Message.findAll({
      where: { guild }
    });

    const introMessage = randomMessage(
      myMessages,
      myMessage => myMessage.type === "intro",
      DEFAULT_MESSAGES.intro
    );

    const tierMessage = randomMessage(
      myMessages,
      myMessage => myMessage.tier_id === tier.id && myMessage.type === "draw",
      DEFAULT_MESSAGES.draw
    );

    const rewardMessage = randomMessage(
      myMessages,
      myMessage => myMessage.type === "reward",
      DEFAULT_MESSAGES.reward
    );

    function _sayMessage(message) {
      return sayMessage(message, msg, reward, user, tier);
    }

    return _sayMessage(introMessage.message)
      .then(() => delay(introMessage.delay))
      .then(() => _sayMessage(tierMessage.message))
      .then(() => delay(tierMessage.delay))
      .then(() => sayReward(rewardMessage.message, msg, reward, user, tier));
  }
};
