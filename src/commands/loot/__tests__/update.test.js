jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Loot: { update: jest.fn("update") },
    Tier: { findOne: jest.fn("findOne") }
  };
});

const { Command } = require("discord-akairo");
const { Loot, Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const UpdateCommand = require("../update");

describe("commands/loot/update", () => {
  beforeEach(() => {
    this.command = new UpdateCommand();
    this.updates = { existingName: "Loot", name: null, tier: null };
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

  it("should update only non-null values", async () => {
    Loot.update.mockReturnValue([1]);
    this.updates = { ...this.updates, name: "New Name" };
    await this.command.exec(this.msg, this.updates);

    expect(Loot.update).toHaveBeenCalledWith(
      { name: this.updates.name },
      { where: { name: this.updates.existingName, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.updates.name} updated`
    );
  });

  it("should update the tier if a valid tier is provided", async () => {
    Loot.update.mockReturnValue([1]);
    Tier.findOne.mockReturnValue(this.tier);

    this.updates = { ...this.updates, tier: this.tier.name };
    await this.command.exec(this.msg, this.updates);

    expect(Loot.update).toHaveBeenCalledWith(
      { tier_id: this.tier.id },
      { where: { name: this.updates.existingName, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.updates.existingName} updated`
    );
  });

  it("should notify when tier provided does not exist", async () => {
    Tier.findOne.mockReturnValue(null);
    this.updates = { ...this.updates, tier: this.tier.name };
    await this.command.exec(this.msg, this.updates);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `No tier named ${this.updates.tier} found.`
    );
  });

  it("should notify when the loot does not exist", async () => {
    Loot.update.mockReturnValue([0]);
    await this.command.exec(this.msg, this.updates);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.updates.existingName} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Loot.update.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.updates);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred updating ${this.updates.existingName}`
    );
  });
});
