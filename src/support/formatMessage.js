function formatMessage(message = "", reward, user, tier) {
  return message
    .replace("<reward>", `**${reward.name}**`)
    .replace("<user>", `<@${user.id}>`)
    .replace("<tier>", tier.name);
}

module.exports = formatMessage;
