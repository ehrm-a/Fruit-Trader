const { localTrades } = require("../../json/tradeInfo.json");

module.exports = {
  name: "StopTrades",
  description: "Stops all the trades from being sent.",
  aliases: ["StopTrading"],
  execute(client, msg) {
    if (!client.trading) return msg.reply("> Your trades are already not being sent.");
    client.trading = false;
    if (localTrades.some((t) => t.channel == msg.channel.id)) {
      if (msg.deletable) msg.delete();
      return;
    }
    console.log(`[${new Date().toLocaleTimeString()}] Stopping all trades...`);
    msg.reply("> You have stopped sending trades to all of your channels.");
  },
};
