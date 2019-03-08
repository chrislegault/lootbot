const { Command } = require("discord-akairo");
const x = require("x-ray")();
const logger = require("../../logger");

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
    if (msg.member.id === process.env.RECIPE_USER_ID) {
      return msg.channel.send(process.env.RECIPE_URL);
    }

    return new Promise((resolve, reject) => {
      try {
        x(url, ".fixed-recipe-card .grid-card-image-container", ["a@href"])(
          (err, recipes) => {
            if (err) {
              reject(err);
            }

            var randomItem =
              recipes[Math.floor(Math.random() * recipes.length)];
            msg.channel.send(randomItem);
            resolve(randomItem);
          }
        );
      } catch (err) {
        msg.channel.send("An error occurred getting a recipe.");
        reject("An error occurred getting a recipe.");
        logger.error(err.message);
      }
    });
  }
};
