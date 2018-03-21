jest.mock("discord-akairo");
jest.mock("../../../logger");
jest.mock("../../../models", () => ({
  TrackedRole: { destroy: jest.fn("destroy") }
}));

const logger = require("../../../logger");
const { TrackedRole } = require("../../../models");
const { Command } = require("discord-akairo");
const { checkManagePermissions } = require("../../../support");
const UntrackCommand = require("../untrack");

describe("commands/bookmark/untrack", () => {
  beforeEach(() => {
    this.command = new UntrackCommand();

    this.args = {
      role: { id: "1", name: "Test" }
    };

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

  it("should destroy the passed in tracked role", async () => {
    TrackedRole.destroy.mockReturnValue(1);
    await this.command.exec(this.msg, this.args);

    expect(TrackedRole.destroy).toHaveBeenCalledWith({
      where: { role: this.args.role.id, guild: this.msg.guild.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.role.name} tracking stopped`
    );
  });

  it("should notify when the passed in tracked role does not exist", async () => {
    TrackedRole.destroy.mockReturnValue(0);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.role.name} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    TrackedRole.destroy.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(logger.error).toHaveBeenCalledWith("test");
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred removing ${this.args.role.name}`
    );
  });
});
