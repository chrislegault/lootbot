jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Loot: { destroy: jest.fn("destroy") }
}));

const { Loot } = require("../../../models");
const { Command } = require("discord-akairo");
const { checkManagePermissions } = require("../../../support");
const RemoveCommand = require("../remove");

describe("commands/loot/remove", () => {
  beforeEach(() => {
    this.name = "Loot 1";
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

  it("should destroy the passed in loot", async () => {
    Loot.destroy.mockReturnValue(1);
    await this.command.exec(this.msg, { name: this.name });

    expect(Loot.destroy).toHaveBeenCalledWith({
      where: { name: this.name, guild: this.msg.guild.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(`${this.name} removed`);
  });

  it("should notify when the passed in loot does not exist", async () => {
    Loot.destroy.mockReturnValue(0);
    await this.command.exec(this.msg, { name: this.name });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.name} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Loot.destroy.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, { name: this.name });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred removing ${this.name}`
    );
  });
});
