const migration = require("../20180301022450-generate-tiers");

describe("seeders/20180301022450-generate-tiers", () => {
  beforeEach(() => {
    process.env.GUILD = "1";

    this.queryInterface = {
      bulkInsert: jest.fn("createTable").mockReturnValue(true),
      bulkDelete: jest.fn("dropTable").mockReturnValue(true)
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
});
