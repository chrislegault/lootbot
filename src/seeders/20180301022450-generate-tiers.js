const guild = process.env.GUILD;

if (!guild) {
  throw new Error("GUILD env variable required");
}

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert("Tiers", [
      {
        name: "Common",
        color: "#AAAAAA",
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019496109441024/common.png",
        guild,
        weight: 80.0,
        luckyWeight: 80.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Uncommon",
        color: "#3FA535",
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019515893710858/uncommon.png",
        guild,
        weight: 10.0,
        luckyWeight: 10.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Rare",
        color: "#BA4E97",
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019531018633216/rare.png",
        guild,
        weight: 9.0,
        luckyWeight: 9.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Legendary",
        color: "#E74011",
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019544675024916/legendary.png",
        guild,
        weight: 1.0,
        luckyWeight: 1.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tiers", {
      guild,
      name: {
        [Sequelize.Op.or]: ["Common", "Uncommon", "Rare", "Legendary"]
      }
    });
  }
};
