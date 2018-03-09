jest.mock("discord-akairo");

const { Command } = require("discord-akairo");
const EnableCommand = require("../enable");

describe("commands/administration/enable", () => {
  beforeEach(() => {
    this.command = new EnableCommand();

    this.msg = {
      guild: { id: "1" },
      client: {
        user: { id: "2" },
        settings: {
          set: jest.fn("set").mockReturnValue(true)
        }
      },
      channel: {
        send: jest.fn("send").mockReturnValue(Promise.resolve())
      }
    };
  });

  it("should configure properly", () => {
    expect(Command).toMatchSnapshot();
  });

  it("should set the disabled setting to true", async () => {
    await this.command.exec(this.msg);

    expect(this.msg.client.settings.set).toHaveBeenCalledWith(
      this.msg.guild.id,
      "disabled",
      false
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `<@${this.msg.client.user.id}> enabled`
    );
  });

  it("should notify if any errors occur during the command", async () => {
    this.msg.client.settings.set.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred enabling <@${this.msg.client.user.id}>`
    );
  });
});
