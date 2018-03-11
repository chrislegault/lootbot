jest.mock("dotenv", () => ({
  config: jest.fn("config").mockReturnValue(null)
}));

const migration = require("../20180301022450-generate-tiers");

describe("seeders/20180301022450-generate-tiers", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockImplementation(() => 1487076708000);
    process.env.GUILD = "1";

    this.queryInterface = {
      bulkInsert: jest.fn("createTable").mockReturnValue(true),
      bulkDelete: jest.fn("dropTable").mockReturnValue(true)
    };

    this.Sequelize = {
      Op: { or: "or" }
    };
  });

  afterEach(() => {
    delete process.env.GUILD;
  });

  it("should throw error when seeding if no guild is provided", () => {
    delete process.env.GUILD;

    expect(() => {
      migration.up(this.queryInterface);
    }).toThrowError("GUILD env variable required");
  });

  it("should seed when a guild is provided", () => {
    migration.up(this.queryInterface);
    expect(this.queryInterface.bulkInsert).toMatchSnapshot();
  });

  it("should throw error when rolling back if no guild is provided", () => {
    delete process.env.GUILD;

    expect(() => {
      migration.down(this.queryInterface);
    }).toThrowError("GUILD env variable required");
  });

  it("should rollback when a guild is provided", () => {
    migration.down(this.queryInterface, this.Sequelize);
    expect(this.queryInterface.bulkDelete).toMatchSnapshot();
  });
});
