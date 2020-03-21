const { Command } = require("discord-akairo");
const recipeCrawlers = require("../../support/recipeCrawlers");

let recipes = [];

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

    return new Promise((resolve, reject) => {
      const sampleItem = () => {
        if (recipes.length) {
          const randomItem =
            recipes[Math.floor(Math.random() * recipes.length)];
          msg.channel.send(randomItem);
          resolve(randomItem);
        } else {
          msg.channel.send("An error occurred getting a recipe.");
          reject("An error occurred getting a recipe.");
        }
      };

      if (!recipes.length) {
        const promises = recipeCrawlers.map(recipeSource => recipeSource());
        Promise.all(promises)
          .then(collectedRecipes => [].concat(...collectedRecipes))
          .then(collectedRecipes => {
            recipes = collectedRecipes;
            sampleItem();
          });
      } else {
        sampleItem();
      }
    });
  }
};
