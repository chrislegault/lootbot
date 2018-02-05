const { Command } = require("discord.js-commando");
const OpenCommand = require("../open");

jest.mock("discord.js-commando");

test("it exists", () => {
  expect(OpenCommand).toBeDefined();
});

it("should properly configure", () => {
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
