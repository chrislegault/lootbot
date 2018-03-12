require("dotenv").config();

const Client = require("./client");
const client = new Client();
client.login(process.env.DISCORD_TOKEN);
module.exports = client;
