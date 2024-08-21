const cooldowns = require("../../json/cooldowns.json");

module.exports = {
  name: "SendTrades",
  description: "Sends all of the trades set up into their corresponding channels.",
  duringTrading: false,
  execute(client, msg) {
    const { localTrades, globalTrade } = require("../../json/tradeInfo.json");
    if (!localTrades.length) return msg.reply("> You don't have any channels to send trades to.");
    client.trading = true;
    for (const ltrade of localTrades) {
      const channel = client.channels.cache.get(ltrade.channel);
      const trade = ltrade.current_trade || globalTrade;
      if (!channel || !trade) continue;
      const channelCD = cooldowns.find((c) => c.id == channel.id);
      const interval = channelCD ? channelCD.cooldown : channel.rateLimitPerUser || 5000;
      const trading = setInterval(() => {
        if (!client.trading) return clearInterval(trading);
        channel.sendTyping();
        channel.send(trade);
      }, interval + 2000);
    }
    msg.reply(
      `> Your trades are now being sent to \`${localTrades.length}\` different channel(s).`
    );
    console.log(
      `[${new Date().toLocaleTimeString()}] Starting to send all trades to ${
        localTrades.length
      } different channels...`
    );
  },
};
