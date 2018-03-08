const settings = require("../settings");

describe("models/settings", () => {
  beforeEach(() => {
    this.model = {
      belongsTo: jest.fn("belongsTo").mockReturnValue()
    };

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model)
    };

    this.Sequelize = {
      JSON: "json"
    };
  });

  it("should create the model definition", () => {
    settings(this.sequelize, this.Sequelize);
    expect(this.sequelize.define).toMatchSnapshot();
  });
});
