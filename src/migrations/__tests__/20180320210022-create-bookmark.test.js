const migration = require("../20180320210022-create-bookmark");
const Sequelize = require("../__mocks__/sequelize");

describe("migrations/20180320210022-create-bookmark", () => {
  beforeEach(() => {
    this.queryInterface = {
      createTable: jest.fn("createTable").mockReturnValue(true),
      dropTable: jest.fn("dropTable").mockReturnValue(true)
    };
  });

  it("should apply migration on up", () => {
    migration.up(this.queryInterface, Sequelize);
    expect(this.queryInterface.createTable).toMatchSnapshot();
  });

  it("should rollback migration on down", () => {
    migration.down(this.queryInterface, Sequelize);
    expect(this.queryInterface.dropTable).toMatchSnapshot();
  });
});
