module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Tiers",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        color: {
          type: Sequelize.STRING,
          allowNull: false
        },
        image: {
          type: Sequelize.STRING,
          allowNull: false
        },
        weight: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        luckyWeight: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        guild: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        uniqueKeys: {
          message_unique: {
            fields: ["name", "guild"]
          }
        }
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable("Tiers");
  }
};
