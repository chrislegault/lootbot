const { Command } = require("discord-akairo");
const { stripIndent } = require("common-tags");
const { formatUsage } = require("../../support");

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
      message += `
__${category.id}__\n`;

      const commandText = category
        .map(command => {
          const description = command.description.content || "No Description";
          return `**${command.aliases[0]}:** ${description}`;
        })
        .join("\n");

      message += commandText + "\n";
    });

    return message;
  }

  showCommand(msg, command) {
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
    if (command) {
      return msg.channel.send(this.showCommand(msg, command));
    }

    return msg.channel.send(this.showAll(msg));
  }
}

module.exports = HelpCommand;
