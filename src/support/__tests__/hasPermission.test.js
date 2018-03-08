jest.mock("discord-akairo");

const hasPermission = require("../hasPermission");

fdescribe("support/hasPermission", () => {
  beforeEach(() => {
    this.hasSpy = jest.fn("has");

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

  it("should skip permission checks for the owner", () => {
    this.msg.client.ownerID = this.msg.author.id;
    expect(hasPermission(this.msg, this.command)).toBe(true);
    expect(this.command.options.permissions).toHaveBeenCalledTimes(0);
  });

  it("should perform no checks if command contains no permission check", () => {
    this.command.options.permissions = null;
    expect(hasPermission(this.msg, this.command)).toBe(true);
  });

  describe("function based permissions", () => {
    it("should check permission with msg if a function", () => {
      hasPermission(this.msg, this.command);
      expect(this.command.options.permissions).toHaveBeenCalledWith(this.msg);
    });

    it("should return result of permissions function", () => {
      this.command.options.permissions.mockReturnValue(true);
      expect(hasPermission(this.msg, this.command)).toBe(true);
      this.command.options.permissions.mockReturnValue(false);
      expect(hasPermission(this.msg, this.command)).toBe(false);
    });
  });

  describe("channel based permissions", () => {
    it("should check permission with msg author", () => {
      this.hasSpy.mockReturnValue(true);
      this.command.options.permissions = ["MANAGE_CHANNEL"];
      hasPermission(this.msg, this.command);

      expect(this.hasSpy).toHaveBeenCalledWith(
        this.command.options.permissions
      );

      expect(this.msg.channel.permissionsFor).toHaveBeenCalledWith(
        this.msg.author
      );
    });

    it("should return true if no guild is provided (channels don't exist without guilds)", () => {
      this.msg.guild = null;
      this.command.options.permissions = ["MANAGE_CHANNEL"];
      expect(hasPermission(this.msg, this.command)).toBe(true);
    });

    it("should return true if author has permissions", () => {
      this.hasSpy.mockReturnValue(true);
      this.command.options.permissions = ["MANAGE_CHANNEL"];
      expect(hasPermission(this.msg, this.command)).toBe(true);
    });

    it("should return false if author does not have permissions", () => {
      this.hasSpy.mockReturnValue(false);
      this.command.options.permissions = ["MANAGE_CHANNEL"];
      expect(hasPermission(this.msg, this.command)).toBe(false);
    });
  });

  it("should return false if any error occurs", () => {
    this.command.options.permissions.mockImplementation(() => {
      throw new Error("error!");
    });

    expect(hasPermission(this.msg, this.command)).toEqual(false);
  });
});
