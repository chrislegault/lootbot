const fs = require("fs");
const x = require("x-ray")();
const logger = require("../../logger");
const sites = require("./sites.json");

const currentRecipes = require("./recipes.json");

const crawlRecipes = ({ url, selector }) => {
  return new Promise(resolve => {
    logger.debug(`Crawling ${url} with selector ${selector}`);
    x(url, selector, ["a@href"])((err, recipes) => {
      if (err) {
        logger.error(
          `An error occurred getting a recipe from ${url}, error = ${
            err.message
          }`
        );
        resolve([]);
      }

      logger.debug(
        `Crawling ${url} complete, found ${recipes.length} recipe(s)`
      );

      resolve(recipes);
    });
  });
};

Promise.all(sites.map(site => crawlRecipes(site)))
  .then(collectedRecipes => [].concat(...currentRecipes, ...collectedRecipes))
  .then(collectedRecipes => {
    collectedRecipes = [...new Set(collectedRecipes)].sort();
    fs.writeFileSync(
      __dirname + "/recipes.json",
      JSON.stringify(collectedRecipes, null, 2)
    );
  });
