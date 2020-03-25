const fs = require("fs");
const x = require("x-ray")();
const logger = require("../../logger");
const sites = require("./sites");

const currentRecipes = require("./recipes.json");

const crawlRecipes = ({ url, scope, selector = "a@href" }) => {
  return new Promise(resolve => {
    logger.debug("Crawling", { url, scope, selector });
    x(url, scope, [selector])((err, recipes) => {
      if (err) {
        logger.error("An error occurred getting a recipe", {
          url,
          error: err.message
        });
        resolve([]);
      }

      logger.debug("Crawling complete", { url, recipes: recipes.length });

      resolve(recipes);
    });
  });
};

Promise.all(sites.map(crawlRecipes))
  .then(collectedRecipes => [].concat(...currentRecipes, ...collectedRecipes))
  .then(collectedRecipes => {
    collectedRecipes = [...new Set(collectedRecipes)].sort();
    fs.writeFileSync(
      __dirname + "/recipes.json",
      JSON.stringify(collectedRecipes, null, 2)
    );
  });
