const message = require("../message");

describe("models/message", () => {
  beforeEach(() => {
    this.model = {
      belongsTo: jest.fn("belongsTo").mockReturnValue()
    };

    this.models = {
      Tier: jest.fn("Tier")
    };

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model)
    };

    this.dataTypes = {
      STRING: "string",
      TEXT: "test",
      ENUM: jest.fn((...args) => args.join(",")),
      INTEGER: "integer"
    };
  });

  it("should create the model definition", () => {
    message(this.sequelize, this.dataTypes);
    expect(this.sequelize.define).toMatchSnapshot();
  });

  it("should associate loot with tiers", () => {
    const Message = message(this.sequelize, this.dataTypes);
    Message.associate(this.models);

    expect(Message.belongsTo).toHaveBeenCalledWith(this.models.Tier, {
      foreignKey: "tier_id"
    });
  });
});
