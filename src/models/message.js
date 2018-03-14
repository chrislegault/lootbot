module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "Message",
    {
      name: DataTypes.STRING,
      message: DataTypes.TEXT,
      type: DataTypes.ENUM("intro", "draw", "reward"),
      tier_id: DataTypes.INTEGER,
      user_id: DataTypes.STRING,
      guild: DataTypes.STRING,
      delay: DataTypes.INTEGER
    },
    {
      paranoid: true
    }
  );

  Message.associate = function(models) {
    Message.belongsTo(models.Tier, {
      foreignKey: "tier_id"
    });
  };

  return Message;
};
