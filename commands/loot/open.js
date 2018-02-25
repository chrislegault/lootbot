const { RichEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const chance = require("chance")();
const database = require("../../database");
const messages = require("../../support/messages");
const tiers = require("../../support/tiers");
const delay = require("../../support/delay");

function sayMessage(message, msg, reward, user) {
  return msg.say(messages.formatMessage(message, reward, user));
}

function sayReward(message, msg, reward, user) {
  var embed = new RichEmbed()
    .setColor(tiers[reward.tier].color)
    .setDescription(messages.formatMessage(message, reward, user))
    .setImage(tiers[reward.tier].image);

  return msg.embed(embed);
}

module.exports = class LootOpen extends Command {
  constructor(client) {
    super(client, {
      name: "open",
      group: "loot",
      memberName: "reply",
      description: "Opens a lootbox",
      examples: ["open"],
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

    return database.list(guild).then(loot => {
      const weights = loot.map(reward => reward.weight);
      const reward = chance.weighted(loot, weights);

      function _sayMessage(message) {
        return sayMessage(message, msg, reward, user);
      }

      if (loot.length === 0) {
        msg.say("No loot in the lootbox.");
        return false;
      }

      const introMessage = chance.pickone(messages.intro);
      const rewardMessage = chance.pickone(messages.reward);
      const drawMessage = chance.pickone(
        messages.draw.filter(drawMessage => drawMessage.tier === reward.tier)
      );

      return _sayMessage(introMessage.message)
        .then(() => delay(introMessage.delay))
        .then(() => _sayMessage(drawMessage.message))
        .then(() => delay(drawMessage.delay))
        .then(() => sayReward(rewardMessage.message, msg, reward, user));
    });
  }
};
