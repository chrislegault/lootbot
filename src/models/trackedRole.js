module.exports = (sequelize, DataTypes) => {
  var TrackedRole = sequelize.define(
    "TrackedRole",
    {
      guild: DataTypes.STRING,
      role: DataTypes.STRING,
      weight: DataTypes.FLOAT
    },
    {
      paranoid: true
    }
  );

  TrackedRole.associate = function() {};

  return TrackedRole;
};
