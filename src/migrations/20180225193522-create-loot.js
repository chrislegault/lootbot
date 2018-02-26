module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Loots",
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
        tier: {
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
          name_unique: {
            fields: ["name", "guild"]
          }
        }
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable("Loots");
  }
};
