const { Listener } = require("discord-akairo");
const logger = require("../logger");

class CommandFinishedListener extends Listener {
  constructor() {
    super("commandFinished", {
      eventName: "commandFinished",
      emitter: "commandHandler"
    });
  }

  exec(msg, command) {
    logger.info("Command finished", {
      name: command.id
    });
  }
}

module.exports = CommandFinishedListener;
