const { Listener } = require("discord-akairo");
const logger = require("../logger");

class CommandStartedListener extends Listener {
  constructor() {
    super("commandStarted", {
      eventName: "commandStarted",
      emitter: "commandHandler"
    });
  }

  exec(msg, command) {
    logger.info("Command started", {
      name: command.id
    });
  }
}

module.exports = CommandStartedListener;
