jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Loot: { findOrCreate: jest.fn("findOrCreate") },
    Tier: { findOne: jest.fn("findOne") }
  };
});

const { Command } = require("discord-akairo");
const { Loot, Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const AddCommand = require("../add");

describe("commands/loot/add", () => {
  beforeEach(() => {
    this.command = new AddCommand();
    this.name = "Loot";
    this.tier = { id: 1, name: "Common" };

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

  it("should query for the passed in tier", () => {
    this.command.exec(this.msg, {
      name: "Loot",
      tier: this.tier.name
    });

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { name: this.tier.name, guild: this.msg.guild.id }
    });
  });

  it("should notify when a tier isn't found", async () => {
    await this.command.exec(this.msg, {
      name: "Loot",
      tier: this.tier.name
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "A valid tier must be provided."
    );
  });

  it("should create the loot", async () => {
    Tier.findOne.mockReturnValue(this.tier);
    Loot.findOrCreate.mockReturnValue([{}, true]);

    await this.command.exec(this.msg, {
      name: "Loot",
      tier: this.tier.name
    });

    expect(Loot.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.tier.name, guild: this.msg.guild.id },
      defaults: { name: this.name, tier_id: this.tier.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(`${this.name} added.`);
  });

  it("should notify when the loot added already exists", async () => {
    Tier.findOne.mockReturnValue(this.tier);
    Loot.findOrCreate.mockReturnValue([{}, false]);

    await this.command.exec(this.msg, {
      name: "Loot",
      tier: this.tier.name
    });

    expect(Loot.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.tier.name, guild: this.msg.guild.id },
      defaults: { name: this.name, tier_id: this.tier.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.name} already exists.`
    );
  });

  it("should notify if any errors occur during the command", async () => {
    Tier.findOne.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, {
      name: "Loot",
      tier: this.tier.name
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred adding ${this.name}`
    );
  });
});
