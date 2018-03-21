module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      "Bookmarks",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        guild: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false
        },
        weight: {
          type: Sequelize.INTEGER,
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
        }
      },
      {
        uniqueKeys: {
          bookmark_unique: {
            fields: ["role", "guild", "deletedAt"],
            customIndex: true
          }
        }
      }
    ),
  down: queryInterface => queryInterface.dropTable("Bookmarks")
};
