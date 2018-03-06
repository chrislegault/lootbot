jest.mock("discord-akairo");
jest.mock("../../../models", () => {
  return {
    Tier: { findOrCreate: jest.fn("findOrCreate") }
  };
});

const { Command } = require("discord-akairo");
const { Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const AddCommand = require("../add");

describe("commands/tier/add", () => {
  beforeEach(() => {
    this.command = new AddCommand();

    this.args = {
      name: "Tier 1",
      color: "#ffffff",
      image: { href: "http://someimage.png" },
      weight: 5,
      luckyWeight: 10
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

  it("should create the tier", async () => {
    let { image, ...defaults } = this.args;

    Tier.findOrCreate.mockReturnValue([{}, true]);
    await this.command.exec(this.msg, this.args);

    expect(Tier.findOrCreate).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id },
      defaults: { ...defaults, image: image.href, guild: this.msg.guild.id }
    });

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} added`
    );
  });

  it("should notify when the loot added already exists", async () => {
    Tier.findOrCreate.mockReturnValue([{}, false]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} already exists`
    );
  });

  it("should notify if any errors occur", async () => {
    Tier.findOrCreate.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred adding ${this.args.name}`
    );
  });
});
