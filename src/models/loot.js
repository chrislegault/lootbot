module.exports = (sequelize, DataTypes) => {
  var Loot = sequelize.define(
    "Loot",
    {
      name: DataTypes.STRING,
      guild: DataTypes.STRING
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
