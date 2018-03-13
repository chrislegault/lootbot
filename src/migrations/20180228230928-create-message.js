module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Messages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        message: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        type: {
          allowNull: false,
          type: Sequelize.ENUM("intro", "draw", "reward")
        },
        tier_id: {
          allowNull: true,
          type: Sequelize.INTEGER,
          references: {
            model: "Tiers",
            key: "id"
          }
        },
        user_id: {
          allowNull: true,
          type: Sequelize.STRING
        },
        guild: {
          allowNull: false,
          type: Sequelize.STRING
        },
        delay: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          type: Sequelize.DATE
        }
      },
      {
        uniqueKeys: {
          message_unique: {
            fields: ["name", "guild", "deletedAt"],
            customIndex: true
          }
        }
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable("Messages");
  }
};
