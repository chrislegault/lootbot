jest.mock("discord.js-commando");
jest.mock("chance");
jest.mock("../../../database");

const chance = require("chance");
chance.mockReturnValue({ weighted: jest.fn() });

const { Command } = require("discord.js-commando");

const OpenCommand = require("../open");
const database = require("../../../database");

jest.useFakeTimers();

describe("commands/loot/open", () => {
  beforeEach(() => {
    chance().weighted = jest.fn();
  });

  it("exists", () => {
    expect(OpenCommand).toBeDefined();
  });

  it("configures properly", () => {
    const client = jest.fn("client");
    const command = new OpenCommand(client);
    expect(Command).toMatchSnapshot();
  });

  xit("shows the result of the draw", done => {
    const client = jest.fn("client");
    const command = new OpenCommand(client);
    const loot = [{ name: "Test", weight: 100 }];
    const msg = {
      say: jest.fn().mockReturnValue(Promise.resolve()),
      guild: { id: 1 }
    };

    chance().weighted.mockReturnValue(loot[0]);
    database.list = () => Promise.resolve(loot);

    const promise = command.run(msg, { user: { id: 1 } }).then(function() {
      console.log("done");
      done();
    });

    // expect(setTimeout).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(10);
    //jest.advanceTimersByTime(2000);

    // expect(setTimeout).toHaveBeenCalledTimes(2);
    //jest.advanceTimersByTime(5000);

    //await expect(promise).resolves.toBe(true);
  });

  xit("shows the no loot message", async () => {
    const loot = [];

    const msg = {
      say: jest.fn().mockReturnValue(Promise.resolve()),
      guild: { id: 1 }
    };

    const command = new OpenCommand(jest.fn());

    database.list = jest.fn().mockImplementation(() => Promise.resolve(loot));
    const result = await command.run(msg, { user: { id: 1 } });

    expect(chance().weighted).not.toHaveBeenCalled();
    expect(msg.say).toHaveBeenCalledTimes(1);
    expect(msg.say).toHaveBeenCalledWith("No loot in the lootbox.");
  });
});
