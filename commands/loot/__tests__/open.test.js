jest.mock("discord.js-commando");
jest.mock("chance");
jest.mock("../../../database");

const chance = require("chance");
chance.mockReturnValue({ weighted: jest.fn() });

const { Command } = require("discord.js-commando");

const OpenCommand = require("../open");
const database = require("../../../database");

describe("commands/loot/open", () => {
  beforeEach(() => {
    chance().weighted = jest.fn();
  });

  it("exists", () => {
    expect(OpenCommand).toBeDefined();
  });

  it("configures properly", () => {
    const client = jest.fn();
    const command = new OpenCommand(client);

    expect(Command).toHaveBeenCalledWith(client, {
      name: "open",
      group: "loot",
      memberName: "reply",
      description: "Opens a lootbox",
      examples: ["open"],
      args: [
        {
          key: "user",
          prompt: "Which user would you like to open a lootbox for?",
          type: "member"
        }
      ]
    });
  });

  it("shows the result of the draw", async () => {
    const loot = [{ name: "Test", weight: 100 }];
    const msg = { say: jest.fn() };
    const command = new OpenCommand(jest.fn());

    chance().weighted.mockReturnValue(loot[0]);
    database.list = jest.fn().mockImplementation(() => Promise.resolve(loot));
    const result = await command.run(msg);

    expect(chance().weighted).toHaveBeenCalledWith(loot, [loot[0].weight]);
    expect(msg.say).toHaveBeenCalledWith(
      `Congratulations, you won ${loot[0].name}!`
    );
  });

  it("shows the no loot message", async () => {
    const loot = [];
    const msg = { say: jest.fn() };
    const command = new OpenCommand(jest.fn());

    database.list = jest.fn().mockImplementation(() => Promise.resolve(loot));
    const result = await command.run(msg);

    expect(chance().weighted).not.toHaveBeenCalled();
    expect(msg.say).toHaveBeenCalledWith("No loot in the lootbox.");
  });
});
