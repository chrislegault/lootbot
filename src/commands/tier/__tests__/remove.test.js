jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Tier: { destroy: jest.fn("destroy") }
}));

const { Tier } = require("../../../models");
const { Command } = require("discord-akairo");
const { checkManagePermissions } = require("../../../support");
const RemoveCommand = require("../remove");

describe("commands/loot/remove", () => {
  beforeEach(() => {
    this.command = new RemoveCommand();
    this.args = { name: "Tier 1" };

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

  it("should destroy the passed in tier", async () => {
    Tier.destroy.mockReturnValue(1);
    await this.command.exec(this.msg, this.args);

    expect(Tier.destroy).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} removed`
    );
  });

  it("should notify when the passed in loot does not exist", async () => {
    Tier.destroy.mockReturnValue(0);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Tier.destroy.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred removing ${this.args.name}`
    );
  });
});
