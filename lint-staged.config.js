module.exports = {
  "*.js": ["yarn lint", "git add", "yarn test --bail --findRelatedTests"]
};
