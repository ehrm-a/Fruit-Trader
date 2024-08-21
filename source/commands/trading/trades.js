const { createPages, createList, capitalize } = require("../../functions");
const { prefix } = require("../../json/config.json");

module.exports = {
  name: "Trades",
  description: "Shows all of the current trades set up and their corresponding channel.",
  aliases: ["TradeList"],
  arguments: ["<page number>"],
  execute(client, msg, args) {
    const { localTrades } = require("../../json/tradeInfo.json");
    if (!localTrades.length) return msg.reply("> You don't have any trades to show.");
    const pages = createPages(localTrades, 5);
    const pageNumber = Number(args[0]) || 1;
    const currentPage = pages[pageNumber - 1];
    if (pageNumber < 0 || !currentPage)
      return msg.reply("> You didn't specify a valid page number.");
    const trades = [`## Current Trades [${localTrades.length}]`];
    for (i of currentPage) {
      const item = [];
      for (k in i) {
        const channel = client.channels.cache.get(i[k]);
        item.push(
          `**${capitalize(k)}:** ${
            channel ||
            "\n" + createList(i[k].replace(/<|(?<=:)[0-9]+>/g, "").split("\n"), "> `", "`")
          }`
        );
      }
      trades.push(`- ${item.join(" | ")}`);
    }
    trades.push(
      `### Showing Page ${pageNumber}/${pages.length}, type \`${prefix}trades <page number>\` for more pages.`
    );
    msg.reply(createList(trades));
  },
};
