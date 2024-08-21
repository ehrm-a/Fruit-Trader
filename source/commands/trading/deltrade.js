const fs = require("fs");
const tradeInfo = require("../../json/tradeInfo.json");

module.exports = {
  name: "DelTrade",
  description: "Deletes or removes a specific trade/channel from the trading list.",
  requiresArgs: true,
  duringTrading: false,
  arguments: ['<channel or "here">'],
  execute(client, msg, args, isSubtle) {
    const channelId = args.shift().toLowerCase();
    const channel =
      channelId == "here"
        ? msg.channel
        : client.channels.cache.get(channelId) || msg.mentions.channels.first();
    if (!channel) return msg.reply(`> \`${channelId}\` isn't a valid channel ID.`);
    const channelInfo = tradeInfo.localTrades.findIndex((t) => t.channel == channel.id);
    if (channelInfo < 0) {
      if (channelId != "here")
        msg.reply(
          `> The channel \`${channel.name}\` in \`${channel.guild.name}\` is already not in the trades list.`
        );
      return;
    }
    tradeInfo.localTrades.splice(channelInfo, 1);
    fs.writeFile("./json/tradeInfo.json", JSON.stringify(tradeInfo), (e) => {
      if (e) {
        msg.reply(
          "> There was an error while deleting the trade from that channel. Check the console."
        );
        throw e;
      }
      if ((channel.id == msg.channel.id || isSubtle) && msg.deletable) return msg.delete();
      msg.reply(
        `> The channel \`${channel.name}\` in \`${channel.guild.name}\` has been removed from the trade list.`
      );
    });
  },
};
