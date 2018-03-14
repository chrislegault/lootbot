require("dotenv").config();

const logger = require("./logger");
const Client = require("./client");
const client = new Client();

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => logger.info("Client authenticated"));

module.exports = client;
