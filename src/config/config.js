module.exports = {
  development: {
    dialect: "sqlite",
    storage: "lootbot.sqlite",
    operatorsAliases: false,
    seederStorage: "sequelize"
  },
  production: {
    dialect: "sqlite",
    storage: "./lootbot.sqlite",
    operatorsAliases: false
  }
};
