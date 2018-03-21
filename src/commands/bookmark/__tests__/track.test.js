jest.mock("discord-akairo");
jest.mock("../../../logger");
jest.mock("../../../models", () => {
  return {
    TrackedRole: { findOrCreate: jest.fn("findOrCreate") }
  };
});

const { Command } = require("discord-akairo");
const { TrackedRole } = require("../../../models");
const logger = require("../../../logger");
const { checkManagePermissions } = require("../../../support");
const TrackCommand = require("../track");

describe("commands/bookmarks/track", () => {
  beforeEach(() => {
    this.command = new TrackCommand();

    this.args = {
      role: { id: "1", name: "Test" },
      weight: 1
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

  it("should have the proper permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should create the tracked role", async () => {
    TrackedRole.findOrCreate.mockReturnValue([{}, true]);
    await this.command.exec(this.msg, this.args);

    expect(TrackedRole.findOrCreate).toHaveBeenCalledWith({
      where: { role: this.args.role.id, guild: this.msg.guild.id },
      defaults: {
        role: this.args.role.id,
        guild: this.msg.guild.id,
        weight: this.args.weight
      }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.role.name} tracked`
    );
  });

  it("should notify when the tracked role added already exists", async () => {
    TrackedRole.findOrCreate.mockReturnValue([{}, false]);
    await this.command.exec(this.msg, this.args);

    expect(TrackedRole.findOrCreate).toHaveBeenCalledWith({
      where: { role: this.args.role.id, guild: this.msg.guild.id },
      defaults: {
        role: this.args.role.id,
        guild: this.msg.guild.id,
        weight: this.args.weight
      }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.role.name} already tracked`
    );
  });

  it("should notify if any errors occur during the command", async () => {
    TrackedRole.findOrCreate.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(logger.error).toHaveBeenCalledWith("test");
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred tracking ${this.args.role.name}`
    );
  });
});
