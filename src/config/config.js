module.exports = {
  development: {
    dialect: "sqlite",
    storage: "lootbot.sqlite",
    operatorsAliases: false
  },
  production: {
    dialect: "sqlite",
    storage: "./lootbot.sqlite",
    operatorsAliases: false
  }
};
