const { RichEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const chance = require("chance")();
const { Loot, Tier, Message } = require("../../models");
const formatMessage = require("../../support/formatMessage");
const delay = require("../../support/delay");

function sayMessage(message, msg, reward, user, tier) {
  return msg.say(formatMessage(message, reward, user, tier));
}

function sayReward(message, msg, reward, user, tier) {
  var embed = new RichEmbed()
    .setColor(tier.color)
    .setDescription(formatMessage(message, reward, user, tier))
    .setImage(tier.image);

  return msg.embed(embed);
}

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "loot:open",
      group: "loot",
      memberName: "open",
      description: "Opens a lootbox",
      examples: ["loot:open"],
      userPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
      args: [
        {
          key: "user",
          prompt: "Which user would you like to open a lootbox for?",
          type: "member"
        }
      ]
    });
  }

  async run(msg, { user }) {
    const guild = msg.guild.id;

    const tiers = await Tier.findAll({
      include: [
        {
          model: Loot
        }
      ],
      where: { guild }
    });

    const myMessages = await Message.findAll({
      where: { guild }
    });

    if (tiers.filter(tier => tier.Loots.length > 0).length === 0) {
      msg.say("No loot in the lootbox.");
      return null;
    }

    const weights = tiers.map(tier => tier.weight);
    const tier = chance.weighted(tiers, weights);

    if (tier.Loots.length === 0) {
      msg.say(`${tier.name} loot won, but no prizes are registered.`);
      return null;
    }

    const reward = chance.pickone(tier.Loots);

    function _sayMessage(message) {
      return sayMessage(message, msg, reward, user, tier);
    }

    const introMessage = chance.pickone(
      myMessages.filter(myMessage => myMessage.type === "draw")
    );

    const tierMessage = chance.pickone(
      myMessages.filter(
        myMessage =>
          myMessage.tier_id === reward.tier_id && myMessage.type === "tier"
      )
    );

    const rewardMessage = chance.pickone(
      myMessages.filter(myMessage => myMessage.type === "reward")
    );

    return _sayMessage(introMessage.message)
      .then(() => delay(introMessage.delay))
      .then(() => _sayMessage(tierMessage.message))
      .then(() => delay(tierMessage.delay))
      .then(() => sayReward(rewardMessage.message, msg, reward, user, tier));
  }
};
