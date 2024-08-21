const fs = require("fs");
const replacements = require("../../json/replacements.json");

module.exports = {
  name: "SetTrade",
  description: "Sets up a new or changes an existing trade of the mentioned channel.",
  requiresArgs: true,
  duringTrading: false,
  arguments: [
    '<channel or "here">',
    '<channel or "here"> <new trade>',
    '<channel or "here"> default',
  ],
  execute(client, msg, args, isSubtle) {
    const tradeInfo = require("../../json/tradeInfo.json");
    const channelId = args.shift().toLowerCase();
    const channel =
      channelId == "here"
        ? msg.channel
        : client.channels.cache.get(channelId) || msg.mentions.channels.first();
    if (!channel) {
      if (!isSubtle) msg.reply(`> \`${channelId}\` isn't a valid channel ID.`);
      return;
    }
    let newTrade = args.join(" ").replace(/^\n/g, "");
    if (!newTrade) return msg.reply("> You must specify a new trade.");
    if (newTrade.toLowerCase() == "default") newTrade = "";
    const channelInfo = tradeInfo.localTrades.find((t) => t.channel == channel.id);
    const serverReplacements = replacements.filter((r) => r.server == msg.guild.id);
    for (let replacement of serverReplacements) {
      const regexp = new RegExp(replacement.replacement, "g");
      newTrade = newTrade.replace(regexp, replacement.target);
    }
    if (!channelInfo)
      tradeInfo.localTrades.push({
        channel: channel.id,
        current_trade: newTrade,
      });
    else channelInfo.current_trade = newTrade;
    fs.writeFile("./json/tradeInfo.json", JSON.stringify(tradeInfo), (e) => {
      if (e) {
        msg.reply("> There was an error while setting the trade. Check the console.");
        console.log(e);
        throw e;
      }
      if (isSubtle && msg.deletable) return msg.delete();
      if (channel.id == msg.channel.id)
        return msg.edit(newTrade).catch(() => {
          if (msg && msg.deletable) msg.delete();
        });
      msg.reply(
        `> The trade for the channel \`${channel.name}\` in \`${
          channel.guild.name
        }\` has been set to: \n > ${newTrade || "Default"}`
      );
    });
  },
};
