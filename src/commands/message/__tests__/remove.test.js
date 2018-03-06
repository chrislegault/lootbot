jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Message: { destroy: jest.fn("destroy") }
}));

const { Message } = require("../../../models");
const { Command } = require("discord-akairo");
const { checkManagePermissions } = require("../../../support");
const RemoveCommand = require("../remove");

describe("commands/message/remove", () => {
  beforeEach(() => {
    this.args = { name: "msg1" };
    this.command = new RemoveCommand();

    this.msg = {
      guild: { id: "1234" },
      channel: {
        send: jest.fn("send").mockReturnValue(Promise.resolve())
      }
    };
  });

  it("should configure properly", () => {
    expect(Command).toMatchSnapshot();
  });

  it("should have the manage permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should destroy the passed in message", async () => {
    Message.destroy.mockReturnValue(1);
    await this.command.exec(this.msg, this.args);

    expect(Message.destroy).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} removed`
    );
  });

  it("should notify when the passed in message does not exist", async () => {
    Message.destroy.mockReturnValue(0);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Message.destroy.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred removing ${this.args.name}`
    );
  });
});
