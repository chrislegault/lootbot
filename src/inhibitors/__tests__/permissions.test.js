jest.mock("discord-akairo");

jest.mock("../../support", () => ({
  hasPermission: jest.fn("hasPermission")
}));

const { Inhibitor } = require("discord-akairo");
const { hasPermission } = require("../../support");
const PermissionsInhibitor = require("../permissions");

describe("inhibitors", () => {
  beforeEach(() => {
    this.inhibitor = new PermissionsInhibitor();

    this.msg = {
      client: { ownerID: "1" },
      author: { id: "2" },
      guild: { id: "3" },
      channel: {
        permissionsFor: jest
          .fn("permissionsFor")
          .mockReturnValue({ has: this.hasSpy })
      }
    };

    this.command = {
      options: {
        permissions: jest.fn("permissions").mockReturnValue(true)
      }
    };
  });

  it("should configure properly", () => {
    expect(Inhibitor).toMatchSnapshot();
  });

  it("should resolve if user has permission", () => {
    hasPermission.mockReturnValue(true);
    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
  });

  it("should reject if user does not have permission", () => {
    hasPermission.mockReturnValue(false);
    expect(this.inhibitor.exec(this.msg, this.command)).rejects.toEqual();
  });

  it("should reject if any error occurs", () => {
    const error = new Error("error!");

    hasPermission.mockImplementation(() => {
      throw error;
    });

    expect(this.inhibitor.exec(this.msg, this.command)).rejects.toEqual(error);
  });
});
