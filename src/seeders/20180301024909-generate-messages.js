const { Tier } = require("../models");

function getGuild() {
  if (!process.env.GUILD) {
    throw new Error("GUILD env variable required");
  }

  return process.env.GUILD;
}

function getTier(name, guild) {
  return Tier.findOne({
    where: { guild, name }
  });
}

module.exports = {
  up: async queryInterface => {
    const guild = getGuild();
    const common = await getTier("Common", guild);
    const uncommon = await getTier("Uncommon", guild);
    const rare = await getTier("Rare", guild);
    const legendary = await getTier("Legendary", guild);

    return queryInterface.bulkInsert("Messages", [
      {
        name: "intro1",
        message:
          "Plucky Bookwyrm <user> has opened an MMO Bookclub Lootbox! Let's see what's inside...",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro2",
        message:
          "<user>, my MMO Bookclub Lootboxes are GUARANTEED to give you a sense of pride and accomplishment. Let's see what you've won...",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro3",
        message:
          "Knowing that one day they might win a Legendary prize from a MMO Bookclub Lootbox...it fills <user> with determination.",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro4",
        message:
          "I used to be a bookwyrm like you <user>. And then I took a lootbox to the knee.",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro5",
        message:
          "<user> used a bookmark to open an MMO Bookclub Lootbox...it's super effective!",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro6",
        message: "<user>, triangulating...",
        type: "intro",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "common1",
        message: "Item, get! You've won a <tier> prize!",
        type: "draw",
        tier_id: common.id,
        guild,
        delay: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "uncommon1",
        message:
          "It's dangerous to go alone, take this <user>! You've won an <tier> prize!",
        type: "draw",
        tier_id: uncommon.id,
        guild,
        delay: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "rare1",
        message:
          "Oh my, it looks like you've won a <tier> prize. I will now pause for eight seconds to build some unbearable tension before the big reveal...",
        type: "draw",
        tier_id: rare.id,
        guild,
        delay: 8000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "legendary1",
        message:
          "Holy smokes, you've only gone and won a frickin' Legendary prize! I will now pause for an excruciating NINE SECONDS to build tension before the big reveal...",
        type: "draw",
        tier_id: legendary.id,
        guild,
        delay: 9000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "reward1",
        message:
          "Congratulations <user>, you won <reward>! One of your mod overlords will be along shortly to hook you up.",
        type: "reward",
        guild,
        delay: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const guild = getGuild();

    return queryInterface.bulkDelete("Messages", {
      guild,
      name: {
        [Sequelize.Op.or]: [
          "intro1",
          "intro2",
          "intro3",
          "intro4",
          "intro5",
          "intro6",
          "common1",
          "uncommon1",
          "rare1",
          "legendary1",
          "reward1"
        ]
      }
    });
  }
};
