jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Tier: { update: jest.fn("findOrCreate") }
  };
});

const { Command } = require("discord-akairo");
const { Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const UpdateCommand = require("../update");

describe("commands/tier/add", () => {
  beforeEach(() => {
    this.command = new UpdateCommand();

    this.args = {
      existingName: "Tier 1",
      name: null,
      color: null,
      image: null,
      weight: null,
      luckyWeight: null
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

  it("should update only non-null values", async () => {
    Tier.update.mockReturnValue([1]);
    this.args = { ...this.args, name: "New Name" };
    await this.command.exec(this.msg, this.args);

    expect(Tier.update).toHaveBeenCalledWith(
      { name: this.args.name },
      { where: { name: this.args.existingName, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} updated`
    );
  });

  it("should update the image if provided", async () => {
    Tier.update.mockReturnValue([1]);
    this.args = { ...this.args, image: { href: "test.png" } };
    await this.command.exec(this.msg, this.args);

    expect(Tier.update).toHaveBeenCalledWith(
      { image: this.args.image.href },
      { where: { name: this.args.existingName, guild: this.msg.guild.id } }
    );

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.existingName} updated`
    );
  });

  it("should notify when the tier is not found", async () => {
    Tier.update.mockReturnValue([0]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.existingName} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Tier.update.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred updating ${this.args.existingName}`
    );
  });
});
