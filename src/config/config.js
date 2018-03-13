module.exports = {
  development: {
    dialect: "sqlite",
    storage: "lootbot.sqlite",
    operatorsAliases: false,
    seederStorage: "sequelize"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    operatorsAliases: false,
    seederStorage: "sequelize"
  }
};
