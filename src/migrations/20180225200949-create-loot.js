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
        deletedAt: {
          type: Sequelize.DATE
        },
        tier_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Tiers",
            key: "id"
          }
        }
      },
      {
        uniqueKeys: {
          loot_unique: {
            fields: ["name", "guild", "deletedAt"],
            customIndex: true
          }
        }
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable("Loots");
  }
};
