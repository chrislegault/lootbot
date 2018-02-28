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
        },
        tier_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "Tiers",
            key: "id"
          }
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
