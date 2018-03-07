module.exports = {
  INTEGER: "integer",
  STRING: "string",
  FLOAT: "float",
  DATE: "date",
  ENUM: jest.fn("ENUM").mockImplementation(enums => enums.join(","))
};
