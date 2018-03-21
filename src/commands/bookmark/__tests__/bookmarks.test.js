jest.mock("discord-akairo");
jest.mock("../../../logger");

jest.mock("../../../models", () => ({
  Bookmark: { findAll: jest.fn("findAll") }
}));

const logger = require("../../../logger");
const { Bookmark } = require("../../../models");
const { Command } = require("discord-akairo");
const BookmarksCommand = require("../bookmarks");

describe("commands/bookmark/bookmarks", () => {
  beforeEach(() => {
    this.command = new BookmarksCommand();

    this.msg = {
      guild: { id: "1" },
      member: {
        roles: new Map()
      },
      channel: {
        send: jest.fn("send").mockReturnValue(Promise.resolve())
      }
    };
  });

  it("should configure properly", () => {
    expect(Command).toMatchSnapshot();
  });

  it("should default to 0 bookmarks if no bookmark roles found", async () => {
    Bookmark.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("You have 0 bookmarks");
  });

  it("should default to 0 bookmarks if no matching bookmark roles and user roles found", async () => {
    Bookmark.findAll.mockReturnValue([
      { id: 1, weight: 1, guild: "1", role: "2" }
    ]);

    this.msg.member.roles.set("3", { id: "3" });
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("You have 0 bookmarks");
  });

  it("should notify a user of total bookmarks", async () => {
    Bookmark.findAll.mockReturnValue([
      { id: 1, weight: 1, role: "2" },
      { id: 2, weight: 2, role: "3" }
    ]);

    this.msg.member.roles.set("2", { id: "2" });
    this.msg.member.roles.set("3", { id: "3" });
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("You have 3 bookmarks");
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
