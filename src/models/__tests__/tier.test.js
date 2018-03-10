const tier = require("../tier");

describe("models/tier", () => {
  beforeEach(() => {
    this.model = {
      hasMany: jest.fn("hasMany").mockReturnValue()
    };

    this.tier = { id: "1" };

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model),
      models: {
        Message: { destroy: jest.fn("destroy") },
        Loot: { destroy: jest.fn("destroy") }
      }
    };

    this.dataTypes = {
      STRING: "string",
      INTEGER: "integer",
      FLOAT: "float"
    };
  });

  it("should create the model definition", () => {
    tier(this.sequelize, this.dataTypes);
    expect(this.sequelize.define).toMatchSnapshot();
  });

  it("should associate tier with loot", () => {
    const Tier = tier(this.sequelize, this.dataTypes);
    Tier.associate(this.sequelize.models);

    expect(Tier.hasMany).toHaveBeenCalledWith(this.sequelize.models.Loot, {
      foreignKey: "tier_id"
    });
  });

  it("should associate tier with message", () => {
    const Tier = tier(this.sequelize, this.dataTypes);
    Tier.associate(this.sequelize.models);

    expect(Tier.hasMany).toHaveBeenCalledWith(this.sequelize.models.Message, {
      foreignKey: "tier_id"
    });
  });

  it("should cascade destroy all related messages", () => {
    const transaction = jest.fn("transaction");
    this.sequelize.models.Loot.destroy.mockReturnValue(true);
    this.sequelize.models.Message.destroy.mockReturnValue(true);

    tier(this.sequelize, this.dataTypes);

    this.sequelize.define.mock.calls[0][2].hooks.afterDestroy(this.tier, {
      transaction
    });

    expect(this.sequelize.models.Message.destroy).toHaveBeenCalledWith({
      where: { tier_id: this.tier.id },
      transaction
    });

    expect(this.sequelize.models.Loot.destroy).toHaveBeenCalledWith({
      where: { tier_id: this.tier.id },
      transaction
    });
  });
});
