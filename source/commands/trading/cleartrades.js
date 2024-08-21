const fs = require("fs");
const tradeInfo = require("../../json/tradeInfo.json");

module.exports = {
  name: "ClearTrades",
  description: "Clears or removes all of the trades you have set up from the trading list.",
  duringTrading: false,
  execute(client, msg, args) {
    if (!tradeInfo.localTrades.length)
      return msg.reply("> You don't have any trades set up to clear.");
    const options = ["y", "yes", "n", "no"];
    const getOption = (str) => options.find((o) => o == str.toLowerCase());
    msg.reply(
      "> Are you sure you wanna perform this action? All of your trades will be cleared. `Y/N`"
    );
    const msgCollector = msg.channel.createMessageCollector({
      filter: (m) => m.author.id == msg.author.id && Boolean(getOption(m.content)),
      time: 15000,
      max: 1,
    });
    msgCollector.on("collect", (m) => {
      if (options.indexOf(getOption(m.content)) >= 2) return msgCollector.stop("Declined");
      tradeInfo.localTrades = [];
      fs.writeFile("./json/tradeInfo.json", JSON.stringify(tradeInfo), (e) => {
        if (e) {
          msg.reply("> There was an error while clearing your trades. Check the console.");
          console.log(e);
          throw e;
        }
        msg.reply("> All of your trades have been cleared.");
      });
    });
    msgCollector.on("end", (c, reason) => {
      if (reason == "Declined") msg.reply("> This operation has been declined.");
    });
  },
};
