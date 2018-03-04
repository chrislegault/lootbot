const fs = require("fs");
const path = require("path");

const {
  AkairoClient,
  SequelizeProvider,
  CommandHandler,
  InhibitorHandler
} = require("discord-akairo");

const { Settings } = require("./models");

function read(dir, result = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file !== "__tests__" && file !== "__mocks__") {
      const filepath = path.join(dir, file);

      if (fs.statSync(filepath).isDirectory()) {
        read(filepath, result);
      } else {
        result.push(filepath);
      }
    }
  }

  return result;
}

class CustomCommandHandler extends CommandHandler {
  static readdirRecursive(directory) {
    return read(directory);
  }
}

class CustomInhibitorHandler extends InhibitorHandler {
  static readdirRecursive(directory) {
    return read(directory);
  }
}

class CustomClient extends AkairoClient {
  constructor() {
    super({
      ownerID: process.env.OWNER_ID,
      prefix: "!lootbot",
      commandDirectory: "./src/commands",
      inhibitorDirectory: "./src/inhibitors",
      allowMention: true,
      disableEveryone: true
    });

    this.settings = new SequelizeProvider(Settings, {
      dataColumn: "settings"
    });
  }

  build() {
    this.commandHandler = new CustomCommandHandler(this, this.akairoOptions);

    this.inhibitorHandler = new CustomInhibitorHandler(
      this,
      this.akairoOptions
    );

    return super.build();
  }

  async login(token) {
    await this.settings.init();
    return super.login(token);
  }
}

module.exports = CustomClient;
