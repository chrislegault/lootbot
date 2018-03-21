module.exports = (sequelize, DataTypes) => {
  var Bookmark = sequelize.define(
    "Bookmark",
    {
      guild: DataTypes.STRING,
      role: DataTypes.STRING,
      weight: DataTypes.FLOAT
    },
    {
      paranoid: true
    }
  );

  Bookmark.associate = function() {};

  return Bookmark;
};
