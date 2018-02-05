module.exports = (sequelize, Sequelize) => {
  var Loot = sequelize.define(
    "Loot",
    {
      name: Sequelize.STRING,
      guild: Sequelize.STRING
    },
    {}
  );

  Loot.associate = function(models) {
    Loot.belongsTo(models.Tier, {
      foreignKey: "tier_id"
    });
  };

  return Loot;
};
