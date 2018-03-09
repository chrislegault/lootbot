jest.mock("discord-akairo");

const { Inhibitor } = require("discord-akairo");
const DisabledInhibitor = require("../disabled");

describe("inhibitors/disabled", () => {
  beforeEach(() => {
    this.inhibitor = new DisabledInhibitor();

    this.msg = {
      guild: { id: "1" },
      client: {
        ownerID: "2",
        settings: {
          get: jest.fn("get")
        }
      },
      author: { id: "3" }
    };

    this.command = { id: "test" };
  });

  it("should configure properly", () => {
    expect(Inhibitor).toMatchSnapshot();
  });

  it("should resolve if owner issued command", () => {
    this.msg.author.id = this.msg.client.ownerID;
    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
  });

  it("should resolve if command being run is enable", () => {
    this.command.id = "enable";
    expect(this.inhibitor.exec(this.msg, this.command)).resolves.toEqual();
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
