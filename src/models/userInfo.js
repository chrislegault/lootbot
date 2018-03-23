module.exports = (sequelize, DataTypes) => {
  var UserInfo = sequelize.define(
    "UserInfo",
    {
      bookmarks: DataTypes.INTEGER,
      guild: DataTypes.STRING,
      user_id: DataTypes.STRING,
      trackedRolesUsed: DataTypes.ARRAY(DataTypes.STRING)
    },
    {
      paranoid: true
    }
  );

  UserInfo.associate = function() {};

  return UserInfo;
};
