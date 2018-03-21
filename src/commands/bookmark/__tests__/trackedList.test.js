jest.mock("discord-akairo");
jest.mock("../../../logger");

jest.mock("../../../models", () => ({
  TrackedRole: { findAll: jest.fn("findAll") }
}));

const { TrackedRole } = require("../../../models");
const logger = require("../../../logger");
const { Command } = require("discord-akairo");
const ListCommand = require("../trackedList");

describe("commands/bookmark/list", () => {
  beforeEach(() => {
    this.command = new ListCommand();

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

  it("should fetch the tracked roles", () => {
    TrackedRole.findAll.mockReturnValue([]);
    this.command.exec(this.msg);

    expect(TrackedRole.findAll).toHaveBeenCalledWith({
      where: { guild: this.msg.guild.id }
    });
  });

  it("should notify when no tracked roles are found", async () => {
    TrackedRole.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "No tracked roles found"
    );
  });

  it("should list the tracked roles", async () => {
    TrackedRole.findAll.mockReturnValue([
      {
        role: "1",
        weight: 2
      },
      {
        role: "3",
        weight: 4
      }
    ]);

    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should notify if any errors occur", async () => {
    TrackedRole.findAll.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg);

    expect(logger.error).toHaveBeenCalledWith("test");
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred listing tracked roles"
    );
  });
});
