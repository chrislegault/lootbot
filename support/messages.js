function createMessage(message, delay) {
  return { message, delay };
}

function createDrawMessage(message, tier, delay) {
  return { message, delay, tier };
}

const intro = [
  createMessage(
    "Plucky Bookwyrm <user> has opened an MMO Bookclub Lootbox! Let's see what's inside...",
    1000
  ),
  createMessage(
    "<user>, my MMO Bookclub Lootboxes are GUARANTEED to give you a sense of pride and accomplishment. Let's see what you've won...",
    1000
  ),
  createMessage(
    "Knowing that one day they might win a Legendary prize from a MMO Bookclub Lootbox...it fills <user> with determination.",
    1000
  ),
  createMessage(
    "I used to be a bookwyrm like you <user>. And then I took a lootbox to the knee.",
    1000
  ),
  createMessage(
    "<user> used a bookmark to open an MMO Bookclub Lootbox...it's super effective!",
    1000
  ),
  createMessage("<user>, triangulating...", 1000)
];

const draw = [
  createDrawMessage("Item, get! You've won a Common prize!", "Common", 2000),
  createDrawMessage(
    "It's dangerous to go alone, take this <user>! You've won an Uncommon prize!",
    "Uncommon",
    2000
  ),
  createDrawMessage(
    "Oh my, it looks like you've won a Rare prize. I will now pause for eight seconds to build some unbearable tension before the big reveal...",
    "Rare",
    8000
  ),
  createDrawMessage(
    "Holy smokes, you've only gone and won a frickin' Legendary prize! I will now pause for an excruciating NINE SECONDS to build tension before the big reveal...",
    "Legendary",
    9000
  )
];

const reward = [
  createMessage(
    "Congratulations <user>, you won <reward>! One of your mod overlords will be along shortly to hook you up."
  )
];

function formatMessage(message, reward, user) {
  return message
    .replace("<reward>", `**${reward.name}**`)
    .replace("<user>", `<@${user.id}>`)
    .replace("<tier>", reward.tier);
}

module.exports = {
  intro,
  draw,
  reward,
  formatMessage
};
