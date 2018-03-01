const guild = process.env.GUILD;

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert("Messages", [
      {
        name: "intro1",
        message:
          "Plucky Bookwyrm <user> has opened an MMO Bookclub Lootbox! Let's see what's inside...",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro2",
        message:
          "<user>, my MMO Bookclub Lootboxes are GUARANTEED to give you a sense of pride and accomplishment. Let's see what you've won...",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro3",
        message:
          "Knowing that one day they might win a Legendary prize from a MMO Bookclub Lootbox...it fills <user> with determination.",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro4",
        message:
          "I used to be a bookwyrm like you <user>. And then I took a lootbox to the knee.",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro5",
        message:
          "<user> used a bookmark to open an MMO Bookclub Lootbox...it's super effective!",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "intro6",
        message: "<user>, triangulating...",
        type: "draw",
        guild,
        delay: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Messages", {
      guild,
      name: {
        [Sequelize.Op.or]: [
          "intro1",
          "intro2",
          "intro3",
          "intro4",
          "intro5",
          "intro6"
        ]
      }
    });
  }
};
