module.exports = (sequelize, DataTypes) => {
  var Tier = sequelize.define(
    "Tier",
    {
      name: DataTypes.STRING,
      color: DataTypes.STRING,
      image: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      luckyWeight: DataTypes.FLOAT
    },
    {}
  );
  Tier.associate = function() {
    // associations can be defined here
  };
  return Tier;
};
