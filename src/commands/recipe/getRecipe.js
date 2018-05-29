const { Command } = require("discord-akairo");
var x = require("x-ray")();

const url =
  "https://www.allrecipes.com/recipes/22882/everyday-cooking/cookware-and-equipment/pressure-cooker/instant-pot";

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
    return new Promise((resolve, reject) => {
      x(url, ".fixed-recipe-card .grid-card-image-container", ["a@href"])(
        (err, recipes) => {
          if (err) {
            reject(err);
          }

          var randomItem = recipes[Math.floor(Math.random() * recipes.length)];
          msg.channel.send(randomItem);
          resolve(randomItem);
        }
      );
    });
  }
};
