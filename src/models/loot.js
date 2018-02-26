module.exports = (sequelize, Sequelize) => {
  var Loot = sequelize.define(
    "Loot",
    {
      name: Sequelize.STRING,
      weight: Sequelize.FLOAT,
      luckyWeight: Sequelize.FLOAT,
      guild: Sequelize.STRING,
      tier: Sequelize.STRING
    },
    {}
  );

  Loot.associate = function() {
    // associations can be defined here
  };

  return Loot;
};
