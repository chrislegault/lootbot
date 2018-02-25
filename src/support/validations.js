module.exports = {
  isValidTier: tier =>
    ["Common", "Uncommon", "Rare", "Legendary"].includes(tier)
};
