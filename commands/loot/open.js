const { Command } = require("discord.js-commando");
const chance = require("chance")();
const database = require("../../database");

var sleep = ms => () => {
  return new Promise(resolve =>
    setTimeout(resolve.bind(null, ...arguments), ms)
  );
};

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
    const loot = await database.list(guild);

    if (loot.length === 0) {
      return msg.say("No loot in the lootbox.");
    }

    const weights = loot.map(reward => reward.weight);
    const reward = chance.weighted(loot, weights);

    return sleep(0)()
      .then(() =>
        msg.say(
          `Bookwyrm <@${
            user.id
          }> has opened a Bookclub Lootbox! Let's see what's inside...`
        )
      )
      .then(sleep(2000))
      .then(() =>
        msg.say(
          `Oh my...it looks like you've won an **Uncommon** prize. I will now pause for five seconds to build some unbearable tension before the big reveal.`
        )
      )
      .then(sleep(5000))
      .then(() =>
        msg.say(
          `Congratulations <@${user.id}> , you have won ${
            reward.name
          }! Oooh, ahhhh!`
        )
      );
  }
};
