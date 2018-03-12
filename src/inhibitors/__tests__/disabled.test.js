jest.mock("discord-akairo");

const { Inhibitor } = require("discord-akairo");
const DisabledInhibitor = require("../disabled");

describe("inhibitors/disabled", () => {
  beforeEach(() => {
    this.hasSpy = jest.fn("has").mockReturnValue(false);

    this.msg = {
      guild: { id: "1" },
      channel: {
        permissionsFor: jest
          .fn("permissionsFor")
          .mockReturnValue({ has: this.hasSpy })
      },
      client: {
        ownerID: "2",
        settings: {
          get: jest.fn("get")
        }
      },
      author: { id: "3" }
    };

    this.command = { id: "test" };
    this.inhibitor = new DisabledInhibitor();
  });

  it("should configure properly", () => {
    expect(Inhibitor).toMatchSnapshot();
  });

  it("should resolve if owner issued command", () => {
    this.msg.author.id = this.msg.client.ownerID;
    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
    expect(this.msg.client.settings.get).toHaveBeenCalledTimes(0);
  });

  it("should resolve if administrator issued command", () => {
    this.hasSpy.mockReturnValue(true);

    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
    expect(this.msg.channel.permissionsFor).toHaveBeenCalledWith(
      this.msg.author
    );

    expect(this.hasSpy).toHaveBeenCalledWith(["ADMINISTRATOR"]);
    expect(this.msg.client.settings.get).toHaveBeenCalledTimes(0);
  });

  it("should resolve if command being run is enable", () => {
    this.command.id = "enable";
    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
    expect(this.msg.client.settings.get).toHaveBeenCalledTimes(0);
  });

  it("should get the current disabled state", () => {
    this.msg.client.settings.get.mockReturnValue(false);
    this.inhibitor.exec(this.msg, this.command);

    expect(this.msg.client.settings.get).toHaveBeenCalledWith(
      this.msg.guild.id,
      "disabled",
      false
    );
  });

  it("should resolve if not disabled", async () => {
    this.msg.client.settings.get.mockReturnValue(false);

    await expect(
      this.inhibitor.exec(this.msg, this.command)
    ).resolves.toEqual();
  });

  it("should reject if disabled", async () => {
    this.msg.client.settings.get.mockReturnValue(true);
    await expect(this.inhibitor.exec(this.msg, this.command)).rejects.toEqual();
  });
});
