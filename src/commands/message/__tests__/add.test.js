jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Message: { findOrCreate: jest.fn("findOrCreate") },
    Tier: { findOne: jest.fn("findOne") }
  };
});

const { Command } = require("discord-akairo");
const { Message, Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const AddCommand = require("../add");

describe("commands/message/add", () => {
  beforeEach(() => {
    this.command = new AddCommand();

    this.args = {
      name: "msg1",
      message: "this is a message",
      type: "intro",
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

  it("should add only non-null values", async () => {
    Message.findOrCreate.mockReturnValue([{ id: 1 }, true]);
    this.args.delay = 10;
    await this.command.exec(this.msg, this.args);

    let defaults = { ...this.args, guild: this.msg.guild.id };
    delete defaults.tier;
    delete defaults.user;

    expect(Message.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id },
      defaults
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} added`
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

  it("should add the message with found tier", async () => {
    Tier.findOne.mockReturnValue(this.tier);
    Message.findOrCreate.mockReturnValue([{ id: 1 }, true]);

    this.args.tier = this.tier.name;
    await this.command.exec(this.msg, this.args);

    let defaults = {
      ...this.args,
      guild: this.msg.guild.id,
      tier_id: this.tier.id
    };

    delete defaults.tier;
    delete defaults.delay;
    delete defaults.user;

    expect(Message.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id },
      defaults
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} added`
    );
  });

  it("should add a user if provided", async () => {
    Tier.findOne.mockReturnValue(this.tier);
    Message.findOrCreate.mockReturnValue([{ id: 1 }, true]);

    this.args.user = this.user;
    await this.command.exec(this.msg, this.args);

    let defaults = {
      ...this.args,
      guild: this.msg.guild.id,
      user_id: this.user.id
    };

    delete defaults.tier;
    delete defaults.delay;
    delete defaults.user;

    expect(Message.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id },
      defaults
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} added`
    );
  });

  it("should notify when the message added already exists", async () => {
    Message.findOrCreate.mockReturnValue([{ id: 1 }, false]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} already exists`
    );
  });

  it("should notify if any errors occur during the command", async () => {
    Message.findOrCreate.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred adding ${this.args.name}`
    );
  });
});
