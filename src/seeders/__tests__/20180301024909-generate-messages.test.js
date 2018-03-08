jest.mock("../../models", () => {
  return {
    Tier: { findOne: jest.fn("findOne") }
  };
});

const { Tier } = require("../../models");
const migration = require("../20180301024909-generate-messages");

describe("seeders/20180301024909-generate-messages", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockImplementation(() => 1487076708000);
    process.env.GUILD = "1";
    this.guildId = process.env.GUILD;

    this.queryInterface = {
      bulkInsert: jest.fn("createTable").mockReturnValue(true),
      bulkDelete: jest.fn("dropTable").mockReturnValue(true)
    };

    this.Sequelize = {
      Op: { or: "or" }
    };

    Tier.findOne
      .mockReturnValueOnce({ id: 1 })
      .mockReturnValueOnce({ id: 2 })
      .mockReturnValueOnce({ id: 3 })
      .mockReturnValueOnce({ id: 4 });
  });

  afterEach(() => {
    delete process.env.GUILD;
  });

  it("should throw error when seeding if no guild is provided", async () => {
    delete process.env.GUILD;

    await expect(migration.up(this.queryInterface)).rejects.toThrow(
      "GUILD env variable required"
    );
  });

  it("should fetch all the tiers for guild when seeding", async () => {
    await migration.up(this.queryInterface);

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { guild: this.guildId, name: "Common" }
    });

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { guild: this.guildId, name: "Uncommon" }
    });

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { guild: this.guildId, name: "Rare" }
    });

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { guild: this.guildId, name: "Legendary" }
    });
  });

  it("should seed when guild is provided", async () => {
    await migration.up(this.queryInterface);
    expect(this.queryInterface.bulkInsert).toMatchSnapshot();
  });

  it("should throw error when rolling back if no guild is provided", () => {
    delete process.env.GUILD;

    expect(() => {
      migration.down(this.queryInterface);
    }).toThrowError("GUILD env variable required");
  });

  it("should seed when a guild is provided", () => {
    migration.down(this.queryInterface, this.Sequelize);
    expect(this.queryInterface.bulkDelete).toMatchSnapshot();
  });
});
