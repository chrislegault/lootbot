const tier = require("../tier");

describe("models/tier", () => {
  beforeEach(() => {
    this.model = {
      hasMany: jest.fn("hasMany").mockReturnValue()
    };

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model)
    };

    this.dataTypes = {
      STRING: "string",
      INTEGER: "integer",
      FLOAT: "float"
    };

    this.models = {
      Loot: jest.fn("Tier"),
      Message: jest.fn("Message")
    };
  });

  it("should create the model definition", () => {
    tier(this.sequelize, this.dataTypes);
    expect(this.sequelize.define).toMatchSnapshot();
  });

  it("should associate tier with loot", () => {
    const Tier = tier(this.sequelize, this.dataTypes);
    Tier.associate(this.models);

    expect(Tier.hasMany).toHaveBeenCalledWith(this.models.Loot, {
      foreignKey: "tier_id"
    });
  });

  it("should associate tier with message", () => {
    const Tier = tier(this.sequelize, this.dataTypes);
    Tier.associate(this.models);

    expect(Tier.hasMany).toHaveBeenCalledWith(this.models.Message, {
      foreignKey: "tier_id"
    });
  });
});
