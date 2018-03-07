module.exports = (sequelize, DataTypes) => {
  var Settings = sequelize.define("Settings", {
    settings: DataTypes.JSON
  });

  Settings.associate = function() {};

  return Settings;
};
