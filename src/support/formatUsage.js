module.exports = function formatUsage(command, prefix = null, user = null) {
  const nbcmd = command.replace(/ /g, "\xa0");
  if (!prefix && !user) return `\`${nbcmd}\``;

  let prefixPart;
  if (prefix) {
    if (prefix.length > 1 && !prefix.endsWith(" ")) prefix += " ";
    prefix = prefix.replace(/ /g, "\xa0");
    prefixPart = `\`${prefix}${nbcmd}\``;
  }

  let mentionPart;
  if (user)
    mentionPart = `\`@${user.username.replace(/ /g, "\xa0")}#${
      user.discriminator
    }\xa0${nbcmd}\``;

  return `${prefixPart || ""}${prefix && user ? " or " : ""}${mentionPart ||
    ""}`;
};
