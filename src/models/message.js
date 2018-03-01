module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define(
    "Message",
    {
      name: DataTypes.STRING,
      message: DataTypes.TEXT,
      type: DataTypes.ENUM("draw", "tier", "reward"),
      tier_id: DataTypes.INTEGER,
      user: DataTypes.STRING,
      guild: DataTypes.STRING,
      delay: DataTypes.INTEGER
    },
    {}
  );

  Message.associate = function(models) {
    Message.belongsTo(models.Tier, {
      foreignKey: "tier_id"
    });
  };

  return Message;
};
