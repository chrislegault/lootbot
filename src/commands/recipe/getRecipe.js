const { Command } = require("discord-akairo");
const recipes = require("../../support/recipeCrawlers/recipes.json");

module.exports = class GetRecipe extends Command {
  constructor() {
    super("recipe", {
      aliases: ["recipe"],
      category: "Recipe",
      channelRestriction: "guild",
      description: {
        content: "Get an instant pot recipe",
        examples: ["recipe"]
      }
    });
  }

  async exec(msg) {
    if (msg.member.id === process.env.RECIPE_USER_ID) {
      return msg.channel.send(process.env.RECIPE_URL);
    }

    const randomItem = recipes[Math.floor(Math.random() * recipes.length)];
    msg.channel.send(randomItem);
  }
};
