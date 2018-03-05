jest.mock("discord-akairo");
jest.mock("chance");
jest.mock("../../../models", () => {
  return { Loot: { findAll: jest.fn("findAll") } };
});

const chance = require("chance");
const { Command } = require("discord-akairo");

chance.mockReturnValue({ weighted: jest.fn() });

const { Loot } = require("../../../models");
const OpenCommand = require("../open");

jest.useFakeTimers();

describe("commands/loot/open", () => {
  beforeEach(() => {
    this.msg = {
      say: jest.fn("say").mockReturnValue(Promise.resolve()),
      guild: { id: 1 }
    };

    //chance().weighted = jest.fn();
  });

  xit("should configure properly", () => {
    new OpenCommand();
    expect(Command).toMatchSnapshot();
  });

  xit("shows the no loot message", async () => {
    Loot.findAll.mockReturnValue([]);

    const command = new OpenCommand(jest.fn());
    await command.run(this.msg, { user: { id: 1 } });

    expect(chance().weighted).not.toHaveBeenCalled();
    expect(this.msg.say).toHaveBeenCalledTimes(1);
    expect(this.msg.say).toHaveBeenCalledWith("No loot in the lootbox.");
  });
});
