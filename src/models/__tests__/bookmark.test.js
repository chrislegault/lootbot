const bookmark = require("../bookmark");

describe("models/loot", () => {
  beforeEach(() => {
    this.model = {};

    this.sequelize = {
      define: jest.fn("define").mockReturnValue(this.model)
    };

    this.dataTypes = {
      STRING: "string",
      FLOAT: "float"
    };
  });

  it("should create the model definition", () => {
    bookmark(this.sequelize, this.dataTypes);
    expect(this.sequelize.define).toMatchSnapshot();
  });
});
