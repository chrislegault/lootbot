jest.mock("discord-akairo");
jest.mock("chance");

jest.mock("../../../models", () => {
  return {
    Tier: { findAll: jest.fn("findAll") }
  };
});

const chance = require("chance");
const { Command } = require("discord-akairo");

const chanceSpy = {
  weighted: jest.fn("weighted")
};

chance.mockImplementation(() => chanceSpy);

const { Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const SimulateCommand = require("../simulate");

describe("commands/loot/simulate", () => {
  beforeEach(() => {
    this.command = new SimulateCommand();

    this.tiers = [
      {
        id: 1,
        name: "Tier 1",
        color: 1234,
        image: "tier1.png",
        weight: 15,
        luckyWeight: 30,
        Loots: [{ id: 1 }]
      },
      {
        id: 2,
        name: "Tier 2",
        color: 5678,
        image: "tier2.png",
        weight: 10,
        luckyWeight: 20,
        Loots: []
      }
    ];

    this.args = {
      draws: 10,
      lucky: false
    };

    this.msg = {
      guild: { id: 1 },
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

  it("should notify if no loot is found", async () => {
    Tier.findAll.mockReturnValue([]);
    await this.command.exec(this.msg, this.args);
    expect(this.msg.channel.send).toHaveBeenCalledWith("No tiers found");
  });

  it("should simulate one open per draw number", async () => {
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    Tier.findAll.mockReturnValue(this.tiers);
    await this.command.exec(this.msg, this.args);

    expect(chanceSpy.weighted).toHaveBeenCalledTimes(10);
    expect(chanceSpy.weighted).toHaveBeenCalledWith(this.tiers, [
      this.tiers[0].weight,
      this.tiers[1].weight
    ]);
  });

  it("should simulate one lucky open per draw number", async () => {
    this.args.lucky = true;
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    Tier.findAll.mockReturnValue(this.tiers);
    await this.command.exec(this.msg, this.args);

    expect(chanceSpy.weighted).toHaveBeenCalledTimes(10);
    expect(chanceSpy.weighted).toHaveBeenCalledWith(this.tiers, [
      this.tiers[0].luckyWeight,
      this.tiers[1].luckyWeight
    ]);
  });

  it("should display the results", async () => {
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    Tier.findAll.mockReturnValue(this.tiers);
    await this.command.exec(this.msg, this.args);
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should notify if any errors occur", async () => {
    Tier.findAll.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred simulating`
    );
  });
});
