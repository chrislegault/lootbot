jest.mock("discord-akairo");

const { Command } = require("discord-akairo");
const RemoveCommand = require("../remove");

describe("commands/permissions/remove", () => {
  beforeEach(() => {
    this.command = new RemoveCommand();

    this.args = {
      permission: "manage",
      role: { id: "2345" }
    };

    this.msg = {
      guild: { id: "1234" },
      client: {
        settings: {
          get: jest.fn("get").mockReturnValue({}),
          set: jest.fn("set").mockReturnValue({})
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

  it("should update permissions if there is a matching role found", async () => {
    this.msg.client.settings.get.mockReturnValue({
      manage: [this.args.role.id]
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.client.settings.set).toHaveBeenCalledWith(
      this.msg.guild.id,
      "permissions",
      { manage: [] }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith("Permissions updated");
  });

  it("should not update permissions if the role doesn't belong", async () => {
    this.msg.client.settings.get.mockReturnValue({
      manage: ["9999"]
    });

    await this.command.exec(this.msg, this.args);
    expect(this.msg.client.settings.set).not.toHaveBeenCalled();
  });

  it("should notify if any errors occur", async () => {
    this.msg.client.settings.get.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred updating permissions"
    );
  });
});
