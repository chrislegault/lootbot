jest.mock("discord-akairo");
jest.mock("chance");

jest.mock("../../../models", () => {
  return {
    Tier: { findAll: jest.fn("findAll") },
    Message: { findAll: jest.fn("findAll") }
  };
});

jest.mock("../../../support", () => ({
  delay: jest.fn("delay").mockReturnValue(Promise.resolve()),
  formatMessage: jest.fn("formatMessage"),
  checkManagePermissions: jest.fn("checkManagePermissions")
}));

const chance = require("chance");
const { Command } = require("discord-akairo");

const chanceSpy = {
  weighted: jest.fn("weighted"),
  pickone: jest.fn("pickone")
};

chance.mockImplementation(() => chanceSpy);

const { Tier, Message } = require("../../../models");
const {
  delay,
  formatMessage,
  checkManagePermissions
} = require("../../../support");
const OpenCommand = require("../open");

describe("commands/loot/open", () => {
  beforeEach(() => {
    this.command = new OpenCommand();

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
      user: { id: "1234" },
      lucky: false
    };

    this.msg = {
      guild: { id: "1" },
      client: {
        settings: {
          get: jest.fn("get").mockReturnValue([]),
          set: jest.fn("set").mockReturnValue(true)
        }
      },
      channel: {
        id: "2",
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

  it("should not open if there is already a running game in the channel", async () => {
    this.msg.client.settings.get.mockReturnValue([this.msg.channel.id]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.client.settings.get).toHaveBeenCalledWith(
      this.msg.guild.id,
      "runningGames",
      []
    );

    expect(Tier.findAll).toHaveBeenCalledTimes(0);
  });

  it("should notify if no loot is found", async () => {
    Tier.findAll.mockReturnValue([this.tiers[1]]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "No loot in the lootbox"
    );
  });

  it("should properly choose a tier", async () => {
    Tier.findAll.mockReturnValue(this.tiers);
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    await this.command.exec(this.msg, this.args);

    expect(chanceSpy.weighted).toHaveBeenCalledWith(
      this.tiers,
      this.tiers.map(tier => tier.weight)
    );
  });

  it("should properly choose a lucky tier", async () => {
    Tier.findAll.mockReturnValue(this.tiers);
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    this.args.lucky = true;
    await this.command.exec(this.msg, this.args);

    expect(chanceSpy.weighted).toHaveBeenCalledWith(
      this.tiers,
      this.tiers.map(tier => tier.luckyWeight)
    );
  });

  it("should notify if the winning tier has no loot", async () => {
    Tier.findAll.mockReturnValue(this.tiers);
    chanceSpy.weighted.mockReturnValue(this.tiers[1]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.tiers[1].name} loot won, but no prizes are registered`
    );
  });

  it("should maintain the state of the running game in the channel", async () => {
    const expectedCalls = [
      [this.msg.guild.id, "runningGames", [this.msg.channel.id]],
      [this.msg.guild.id, "runningGames", []]
    ];

    expect.assertions(2);

    this.msg.client.settings.set.mockImplementation((...args) => {
      expect(args).toEqual(
        expectedCalls[this.msg.client.settings.set.mock.calls.length - 1]
      );

      return Promise.resolve();
    });

    Tier.findAll.mockReturnValue(this.tiers);
    Message.findAll.mockReturnValue([]);
    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockReturnValue(this.tiers[0].Loots[0]);
    await this.command.exec(this.msg, this.args);
  });

  it("should properly choose a reward", async () => {
    Tier.findAll.mockReturnValue(this.tiers);
    Message.findAll.mockReturnValue([]);
    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockReturnValue(this.tiers[0].Loots[0]);
    await this.command.exec(this.msg, this.args);
    expect(chanceSpy.pickone).toHaveBeenCalledWith(this.tiers[0].Loots);
  });

  it("should have proper default messages", async () => {
    formatMessage.mockImplementation(message => message);
    Tier.findAll.mockReturnValue(this.tiers);
    Message.findAll.mockReturnValue([]);
    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockImplementation(items => items[0]);
    await this.command.exec(this.msg, this.args);
    jest.runAllTimers();
    expect(formatMessage).toMatchSnapshot();
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should use found matching messages", async () => {
    formatMessage.mockImplementation(message => message);
    Tier.findAll.mockReturnValue(this.tiers);

    Message.findAll.mockReturnValue([
      {
        type: "intro",
        message: "intro message",
        delay: 10
      },
      {
        type: "draw",
        message: "draw message",
        tier_id: this.tiers[0].id,
        delay: 20
      },
      {
        type: "reward",
        message: "reward message"
      }
    ]);

    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockImplementation(items => items[0]);
    await this.command.exec(this.msg, this.args);
    jest.runAllTimers();
    expect(formatMessage).toMatchSnapshot();
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should respect the delay of each message", async () => {
    formatMessage.mockImplementation(message => message);
    Tier.findAll.mockReturnValue(this.tiers);

    Message.findAll.mockReturnValue([
      {
        type: "intro",
        message: "intro message",
        delay: 10
      },
      {
        type: "draw",
        message: "draw message",
        tier_id: this.tiers[0].id,
        delay: 20
      },
      {
        type: "reward",
        message: "reward message"
      }
    ]);

    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockImplementation(items => items[0]);
    await this.command.exec(this.msg, this.args);

    expect(delay).toHaveBeenCalledTimes(2);
    expect(delay.mock.calls[0][0]).toBe(10);
    expect(delay.mock.calls[1][0]).toBe(20);
  });

  it("should properly handle an error", async () => {
    const expectedCalls = [
      [this.msg.guild.id, "runningGames", [this.msg.channel.id]],
      [this.msg.guild.id, "runningGames", []]
    ];

    expect.assertions(3);

    this.msg.client.settings.set.mockImplementation((...args) => {
      expect(args).toEqual(
        expectedCalls[this.msg.client.settings.set.mock.calls.length - 1]
      );

      return Promise.resolve();
    });

    Tier.findAll.mockReturnValue(this.tiers);

    Message.findAll.mockImplementation(() => {
      throw new Error("error!");
    });

    chanceSpy.weighted.mockReturnValue(this.tiers[0]);
    chanceSpy.pickone.mockReturnValue(this.tiers[0].Loots[0]);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred opening a lootbox"
    );
  });

  it("should handle an immediate error", async () => {
    this.msg.client.settings.get.mockImplementation(() => {
      throw new Error("error!");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.client.settings.set).toHaveBeenCalledTimes(0);
    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred opening a lootbox"
    );
  });
});
