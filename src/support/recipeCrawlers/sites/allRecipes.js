const x = require("x-ray")();
const logger = require("../../../logger");

const url =
  "https://www.allrecipes.com/recipes/22882/everyday-cooking/cookware-and-equipment/pressure-cooker/instant-pot";

module.exports = () => {
  return new Promise(resolve => {
    x(url, ".fixed-recipe-card .grid-card-image-container", ["a@href"])(
      (err, recipes) => {
        if (err) {
          logger.error(
            `An error occurred getting a recipe from AllRecipes, error = ${
              err.message
            }`
          );
          resolve([]);
        }

        resolve(recipes);
      }
    );
  });
};
