const fs = require("fs");
const path = require("path");

const { CommandHandler, InhibitorHandler } = require("discord-akairo");

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

module.exports = {
  CommandHandler: CustomCommandHandler,
  InhibitorHandler: CustomInhibitorHandler
};
