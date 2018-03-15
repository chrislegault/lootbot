const { AkairoClient, SequelizeProvider } = require("discord-akairo");
const { CommandHandler, InhibitorHandler } = require("./handlers");
const { Settings } = require("./models");

class CustomClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: process.env.OWNER_ID,
        prefix: ["!lootbot", "!lb"],
        commandDirectory: "./src/commands",
        inhibitorDirectory: "./src/inhibitors",
        allowMention: true
      },
      {
        disableEveryone: true
      }
    );

    this.settings = new SequelizeProvider(Settings, {
      dataColumn: "settings"
    });
  }

  build() {
    this.commandHandler = new CommandHandler(this, this.akairoOptions);
    this.inhibitorHandler = new InhibitorHandler(this, this.akairoOptions);
    return super.build();
  }

  async login(token) {
    await this.settings.init();
    return super.login(token);
  }
}

module.exports = CustomClient;
