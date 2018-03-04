module.exports = (sequelize, DataTypes) => {
  var settings = sequelize.define("Settings", {
    settings: DataTypes.JSON
  });

  settings.associate = function() {};

  return settings;
};
