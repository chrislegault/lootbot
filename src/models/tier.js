module.exports = (sequelize, DataTypes) => {
  var Tier = sequelize.define(
    "Tier",
    {
      name: DataTypes.STRING,
      color: DataTypes.STRING,
      image: DataTypes.STRING,
      guild: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      luckyWeight: DataTypes.FLOAT
    },
    {}
  );

  Tier.associate = function(models) {
    Tier.hasMany(models.Loot, {
      foreignKey: "tier_id"
    });

    Tier.hasMany(models.Message, {
      foreignKey: "tier_id"
    });
  };

  return Tier;
};
