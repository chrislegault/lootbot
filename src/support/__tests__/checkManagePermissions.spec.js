const { Collection } = require("discord.js");
const checkManagePermissions = require("../checkManagePermissions");

describe("support/checkLootPermissions", () => {
  beforeEach(() => {
    this.msg = {
      client: {
        settings: { get: jest.fn("get") }
      },
      guild: { id: 1 },
      member: {
        roles: new Collection()
      }
    };

    this.msg.client.settings.get.mockReturnValue({});
  });

  it("should properly query for permissions", () => {
    checkManagePermissions(this.msg);
    expect(this.msg.client.settings.get).toHaveBeenCalledWith(
      1,
      "permissions",
      {}
    );
  });

  it("should return false if an error occurs fetching permissions", async () => {
    this.msg.client.settings.get = jest.fn(() => {
      throw new Error("");
    });

    const permitted = await checkManagePermissions(this.msg);
    expect(permitted).toBe(false);
  });

  it("should return false if there are no permissions with the given key", async () => {
    const permitted = await checkManagePermissions(this.msg);
    expect(permitted).toBe(false);
  });

  it("should return false if there are no roles for the given permission", async () => {
    this.msg.client.settings.get.mockReturnValue({
      manage: []
    });

    this.msg.member.roles.set("3", { id: "3" });

    const permitted = await checkManagePermissions(this.msg);
    expect(permitted).toBe(false);
  });

  it("should return false if there are no matching roles found on the guild member", async () => {
    this.msg.client.settings.get.mockReturnValue({
      manage: ["1", "2"]
    });

    this.msg.member.roles.set("3", { id: "3" });

    const permitted = await checkManagePermissions(this.msg);
    expect(permitted).toBe(false);
  });

  it("should return true if there is a matching permission role on the guild member", async () => {
    this.msg.client.settings.get.mockReturnValue({
      manage: ["1", "2"]
    });

    this.msg.member.roles.set("2", { id: "2" });

    const permitted = await checkManagePermissions(this.msg);
    expect(permitted).toBe(true);
  });
});
