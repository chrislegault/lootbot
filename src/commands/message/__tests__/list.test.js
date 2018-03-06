jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Message: { findAll: jest.fn("findAll") },
  Tier: { findAll: jest.fn("findAll") }
}));

const { Message, Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const { Command } = require("discord-akairo");
const ListCommand = require("../list");

describe("commands/loot/list", () => {
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

  it("should have the proper permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should fetch the messages for the guild", () => {
    this.command.exec(this.msg);

    expect(Message.findAll).toHaveBeenCalledWith({
      include: [{ model: Tier }],
      where: { guild: this.msg.guild.id }
    });
  });

  it("should notify when no loot is found for the guild", async () => {
    Message.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("No messages found");
  });

  it("should list the messages", async () => {
    Message.findAll.mockReturnValue([
      {
        name: "msg1",
        message: "this is a message",
        type: "intro",
        Tier: null,
        user_id: null
      },
      {
        name: "msg1",
        message: "this is a message",
        type: "intro",
        Tier: { name: "Common" },
        user_id: "1234"
      }
    ]);

    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should notify if any errors occur", async () => {
    Message.findAll.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred listing messages"
    );
  });
});
