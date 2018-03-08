const { Command } = require("discord-akairo");
const { stripIndent } = require("common-tags");
const { hasPermission, formatUsage } = require("../../support");

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help"],
      category: "Utility",
      description:
        "Displays a list of available commands, or detailed information for a specified command.",
      args: [
        {
          id: "command",
          type: "commandAlias",
          prompt: {
            start: "Which command do you need help with?",
            retry: "Please provide a valid command.",
            optional: true
          }
        }
      ],
      options: {
        examples: ["help", "help loot-list"]
      }
    });
  }

  showAll(msg) {
    const prefix = this.handler.prefix(msg);
    const target = msg.guild || "any server";
    const example = formatUsage("command", prefix, msg.client.user);
    const sample = formatUsage("prefix", prefix, msg.client.user);

    let message =
      stripIndent`
        To run a command in ${target}, use ${example}. For example, ${sample}.

        Use help <command> to view detailed information about a specific command.

        __**All commands**__
      ` + "\n";

    msg.client.commandHandler.categories.forEach(category => {
      let permittedCommands = category.map(command => command);

      if (msg.guild) {
        permittedCommands = permittedCommands.filter(command =>
          hasPermission(msg, command)
        );
      }

      if (permittedCommands.length > 0) {
        message += `\n__${category.id}__\n`;

        permittedCommands.forEach(command => {
          const description = command.description.content || "No Description";
          message += `**${command.aliases[0]}:** ${description}\n`;
        });
      }
    });

    return message;
  }

  showCommand(msg, command) {
    if (msg.guild && !hasPermission(msg, command)) {
      return "No permission for this command";
    }

    let help = "";

    const description = {
      content: "",
      examples: [],
      usage: "",
      ...command.description
    };

    const usage = description.usage
      ? `${command.aliases[0]} ${description.usage}`
      : command.aliases[0];

    const prefix = this.handler.prefix(msg);
    const format = formatUsage(usage, prefix, msg.client.user);

    help += `
__Command **${command.aliases[0]}**__: ${description.content}

**Format:** ${format}
**Group:** ${command.category.id}`;

    if (command.aliases.length > 1) {
      help += `\n**Aliases:** ${command.aliases.join(", ")}`;
    }

    if (description.examples && description.examples.length > 0) {
      help += `\n**Examples:**\n${description.examples.join("\n")}`;
    }

    return help;
  }

  async exec(msg, { command }) {
    let messages = [];

    if (command) {
      messages.push(await msg.author.send(this.showCommand(msg, command)));
    } else {
      messages.push(await msg.author.send(this.showAll(msg)));
    }

    if (msg.channel.type !== "dm") {
      messages.push(await msg.reply("Sent you a DM with information."));
    }

    return messages;
  }
}

module.exports = HelpCommand;
