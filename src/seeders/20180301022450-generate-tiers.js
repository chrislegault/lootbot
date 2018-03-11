require("dotenv").config();

function getGuild() {
  if (!process.env.GUILD) {
    throw new Error("GUILD env variable required");
  }

  return process.env.GUILD;
}

module.exports = {
  up: queryInterface => {
    const guild = getGuild();

    return queryInterface.bulkInsert("Tiers", [
      {
        name: "Common",
        color: 4737096,
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019496109441024/common.png",
        guild,
        weight: 80.0,
        luckyWeight: 80.0,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        name: "Uncommon",
        color: 4171061,
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019515893710858/uncommon.png",
        guild,
        weight: 10.0,
        luckyWeight: 10.0,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        name: "Rare",
        color: 12209815,
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019531018633216/rare.png",
        guild,
        weight: 9.0,
        luckyWeight: 9.0,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        name: "Legendary",
        color: 15155217,
        image:
          "https://media.discordapp.net/attachments/342426492371992576/417019544675024916/legendary.png",
        guild,
        weight: 1.0,
        luckyWeight: 1.0,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    const guild = getGuild();

    return queryInterface.bulkDelete("Tiers", {
      guild,
      name: {
        [Sequelize.Op.or]: ["Common", "Uncommon", "Rare", "Legendary"]
      }
    });
  }
};
