const x = require("x-ray")();
const logger = require("../../../logger");

const url = "https://www.pressurecookrecipes.com/easy-instant-pot-recipes/";

module.exports = () => {
  return new Promise(resolve => {
    x(url, "h3", ["a@href"])((err, recipes) => {
      if (err) {
        logger.error(
          `An error occurred getting a recipe from pressurecookrecipes.com, error = ${
            err.message
          }`
        );
        resolve([]);
      }

      resolve(recipes);
    });
  });
};
