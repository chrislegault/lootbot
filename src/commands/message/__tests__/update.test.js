jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Message: { update: jest.fn("update") },
    Tier: { findOne: jest.fn("findOne") }
  };
});

const { Command } = require("discord-akairo");
const { Message, Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const UpdateCommand = require("../update");

describe("commands/message/update", () => {
  beforeEach(() => {
    this.command = new UpdateCommand();

    this.args = {
      name: "msg1",
      message: null,
      type: null,
      delay: null,
      tier: null,
      user: null
    };

    this.tier = { id: 1, name: "Common" };
    this.user = { id: 1 };

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

  it("should validate the type field", () => {
    expect(Command.mock.calls[0][1].args[2].validate("nonvalid")).toBe(false);
    expect(Command.mock.calls[0][1].args[2].validate("intro")).toBe(true);
    expect(Command.mock.calls[0][1].args[2].validate("draw")).toBe(true);
    expect(Command.mock.calls[0][1].args[2].validate("reward")).toBe(true);
  });

  it("should have the proper permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should update only non-null values", async () => {
    Message.update.mockReturnValue([{ id: 1 }, true]);
    this.args.delay = 10;
    await this.command.exec(this.msg, this.args);

    expect(Message.update).toHaveBeenCalledWith(
      { delay: 10 },
      { where: { name: this.args.name, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} updated`
    );
  });

  it("should query for the passed in tier", () => {
    this.args.tier = this.tier.name;
    this.command.exec(this.msg, this.args);

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { name: this.tier.name, guild: this.msg.guild.id }
    });
  });

  it("should notify when a tier isn't found", async () => {
    Tier.findOne.mockReturnValue(null);
    this.args.tier = this.tier.name;
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "A valid tier must be provided."
    );
  });

  it("should update the message with found tier", async () => {
    Tier.findOne.mockReturnValue(this.tier);
    Message.update.mockReturnValue([1]);

    this.args.tier = this.tier.name;
    await this.command.exec(this.msg, this.args);

    expect(Message.update).toHaveBeenCalledWith(
      { tier_id: this.tier.id },
      { where: { name: this.args.name, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} updated`
    );
  });

  it("should update a user if provided", async () => {
    Message.update.mockReturnValue([1]);

    this.args.user = this.user;
    await this.command.exec(this.msg, this.args);

    expect(Message.update).toHaveBeenCalledWith(
      { user_id: this.user.id },
      { where: { name: this.args.name, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} updated`
    );
  });

  it("should notify when the message does not exist", async () => {
    Message.update.mockReturnValue([0]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} not found`
    );
  });

  it("should notify if any errors occur during the command", async () => {
    Message.update.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred updating ${this.args.name}`
    );
  });
});
