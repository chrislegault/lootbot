module.exports = (sequelize, DataTypes) => {
  var Tier = sequelize.define(
    "Tier",
    {
      name: DataTypes.STRING,
      color: DataTypes.INTEGER,
      image: DataTypes.STRING,
      guild: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      luckyWeight: DataTypes.FLOAT
    },
    {
      paranoid: true,
      hooks: {
        afterDestroy: async (tier, options) =>
          Promise.all([
            sequelize.models.Message.destroy({
              where: { tier_id: tier.id },
              transaction: options.transaction
            }),
            sequelize.models.Loot.destroy({
              where: { tier_id: tier.id },
              transaction: options.transaction
            })
          ])
      }
    }
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
