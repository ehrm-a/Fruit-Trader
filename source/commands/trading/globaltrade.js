const fs = require("fs");
const tradeInfo = require("../../json/tradeInfo.json");

module.exports = {
  name: "GlobalTrade",
  description: "Shows or sets up the default trades for every new trade.",
  aliases: ["GBTrade", "DefaultTrade"],
  duringTrading: false,
  arguments: ["<new trade>"],
  execute(client, msg, args) {
    const newTrade = args.join(" ");
    if (!newTrade) {
      if (!tradeInfo.globalTrade)
        return msg.reply("> You currently don't have a global trade set.");
      msg.reply(`> Your current global trade is set to: \n > ${tradeInfo.globalTrade}`);
      return;
    }
    tradeInfo.globalTrade = newTrade.toLowerCase() == "none" ? "" : newTrade;
    fs.writeFile("./json/tradeInfo.json", JSON.stringify(tradeInfo), (e) => {
      if (e) {
        msg.reply("> There was an error while setting the global trade. Check the console.");
        console.log(e);
        throw e;
      }
      msg.reply(`> Your global trade has been set to: \n > ${tradeInfo.globalTrade || "None"}`);
    });
  },
};
