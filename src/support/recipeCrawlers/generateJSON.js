const fs = require("fs");
const sites = require("./sites");

const currentRecipes = require("./recipes.json");

const promises = sites.map(site => site());
Promise.all(promises)
  .then(collectedRecipes => [].concat(...currentRecipes, ...collectedRecipes))
  .then(collectedRecipes => {
    collectedRecipes = [...new Set(collectedRecipes)].sort();
    fs.writeFileSync(
      __dirname + "/recipes.json",
      JSON.stringify(collectedRecipes, null, 2)
    );
  });
