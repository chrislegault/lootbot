jest.mock("discord-akairo");

const { Inhibitor } = require("discord-akairo");
const PermissionsInhibitor = require("../permissions");

describe("inhibitors", () => {
  beforeEach(() => {
    this.inhibitor = new PermissionsInhibitor();
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

  it("should configure properly", () => {
    expect(Inhibitor).toMatchSnapshot();
  });

  it("should skip permission checks for the owner", async () => {
    this.msg.client.ownerID = this.msg.author.id;

    await expect(
      this.inhibitor.exec(this.msg, this.command)
    ).resolves.toEqual();

    expect(this.command.options.permissions).toHaveBeenCalledTimes(0);
  });

  it("should perform no checks if command contains no permission check", async () => {
    this.command.options.permissions = null;

    await expect(
      this.inhibitor.exec(this.msg, this.command)
    ).resolves.toEqual();
  });

  describe("function based permissions", () => {
    it("should check permission with msg if a function", () => {
      this.inhibitor.exec(this.msg, this.command);
      expect(this.command.options.permissions).toHaveBeenCalledWith(this.msg);
    });

    it("should resolve if permission function returns true", async () => {
      this.command.options.permissions.mockReturnValue(true);

      await expect(
        this.inhibitor.exec(this.msg, this.command)
      ).resolves.toEqual();
    });

    it("should reject if permission function returns false", async () => {
      this.command.options.permissions.mockReturnValue(false);

      await expect(
        this.inhibitor.exec(this.msg, this.command)
      ).rejects.toEqual();
    });
  });

  describe("channel based permissions", () => {
    it("should check permission with msg author", () => {
      this.hasSpy.mockReturnValue(true);
      this.command.options.permissions = ["MANAGE_CHANNEL"];
      this.inhibitor.exec(this.msg, this.command);

      expect(this.hasSpy).toHaveBeenCalledWith(
        this.command.options.permissions
      );

      expect(this.msg.channel.permissionsFor).toHaveBeenCalledWith(
        this.msg.author
      );
    });

    it("should resolve if no guild is provided (channels don't exist without guilds)", async () => {
      this.msg.guild = null;
      this.command.options.permissions = ["MANAGE_CHANNEL"];

      await expect(
        this.inhibitor.exec(this.msg, this.command)
      ).resolves.toEqual();
    });

    it("should resolve if author has permissions", async () => {
      this.hasSpy.mockReturnValue(true);
      this.command.options.permissions = ["MANAGE_CHANNEL"];

      await expect(
        this.inhibitor.exec(this.msg, this.command)
      ).resolves.toEqual();
    });

    it("should reject if author does not have permissions", async () => {
      this.hasSpy.mockReturnValue(false);
      this.command.options.permissions = ["MANAGE_CHANNEL"];

      await expect(
        this.inhibitor.exec(this.msg, this.command)
      ).rejects.toEqual();
    });
  });

  it("should reject if any error occurs", async () => {
    const error = new Error("error!");

    this.command.options.permissions.mockImplementation(() => {
      throw error;
    });

    await expect(this.inhibitor.exec(this.msg, this.command)).rejects.toEqual(
      error
    );
  });
});
