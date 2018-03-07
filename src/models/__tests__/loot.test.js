const loot = require("../loot");

describe("models/loot", () => {
  beforeEach(() => {
    this.model = {
      belongsTo: jest.fn("belongsTo").mockReturnValue()
    };

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model)
    };

    this.dataTypes = {
      STRING: "string"
    };

    this.models = {
      Tier: jest.fn("Tier")
    };
  });

  it("should create the model definition", () => {
    loot(this.sequelize, this.dataTypes);
    expect(this.sequelize.define).toMatchSnapshot();
  });

  it("should associate loot with tiers", () => {
    const Loot = loot(this.sequelize, this.dataTypes);
    Loot.associate(this.models);

    expect(Loot.belongsTo).toHaveBeenCalledWith(this.models.Tier, {
      foreignKey: "tier_id"
    });
  });
});
