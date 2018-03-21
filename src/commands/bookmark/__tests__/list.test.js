jest.mock("discord-akairo");
jest.mock("../../../logger");

jest.mock("../../../models", () => ({
  Bookmark: { findAll: jest.fn("findAll") }
}));

const { Bookmark } = require("../../../models");
const logger = require("../../../logger");
const { Command } = require("discord-akairo");
const ListCommand = require("../list");

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

  it("should fetch the bookmarks for the guild", () => {
    Bookmark.findAll.mockReturnValue([]);
    this.command.exec(this.msg);

    expect(Bookmark.findAll).toHaveBeenCalledWith({
      where: { guild: this.msg.guild.id }
    });
  });

  it("should notify when no bookmarks are found for the guild", async () => {
    Bookmark.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("No bookmarks found");
  });

  it("should list the bookmarks", async () => {
    Bookmark.findAll.mockReturnValue([
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
    Bookmark.findAll.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg);

    expect(logger.error).toHaveBeenCalledWith("test");
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred listing bookmarks"
    );
  });
});
