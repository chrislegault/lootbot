const numeral = require("numeral");

module.exports = function formatOdd(odd, total) {
  const percent = numeral(odd / total).format("0.00%");
  return `${percent} (${odd} in ${total})`;
};
