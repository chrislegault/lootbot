const x = require("x-ray")();
const logger = require("../../../logger");

const url = "https://instantpot3.wordpress.com/2016/08/09/one-pot-meals";

module.exports = () => {
  return new Promise(resolve => {
    x(url, ".entry-content h5", ["a@href"])((err, recipes) => {
      if (err) {
        logger.error(
          `An error occurred getting a recipe from instantpot3.wordpress.com, error = ${
            err.message
          }`
        );
        resolve([]);
      }

      resolve(recipes);
    });
  });
};
