module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "UserInfos",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        bookmarks: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        guild: {
          allowNull: false,
          type: Sequelize.STRING
        },
        user_id: {
          allowNull: false,
          type: Sequelize.STRING
        },
        trackedRolesUsed: {
          allowNull: false,
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: []
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
          allowNull: true,
          type: Sequelize.DATE
        }
      },
      {
        uniqueKeys: {
          user_info_unique: {
            fields: ["user_id", "guild", "deletedAt"],
            customIndex: true
          }
        }
      }
    );
  },
  down: queryInterface => queryInterface.dropTable("UserInfos")
};
