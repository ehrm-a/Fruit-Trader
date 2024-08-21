const fs = require("fs");
const { prefix } = require("../../json/config.json");
const replacements = require("../../json/replacements.json");
const { createPages, createList, orderAlphabetically, truncate } = require("../../functions");

module.exports = {
  name: "Replace",
  description:
    "Adds a new word or phrase to be replaced when setting up new trades (Useful for using the same trade in servers with different emotes). Also shows the list of existing replacements or removes one from the list.",
  aliases: ["Replacements", "SetReplacement"],
  arguments: [
    "<page number>",
    "<replacements to search for>",
    "<target> <replacement>",
    "<target> remove",
  ],
  execute(client, msg, args, isSubtle) {
    if (args.length <= 1) {
      let serverReplacements = replacements.sort((a, b) =>
        orderAlphabetically(a.replacement, b.replacement)
      );
      if (!Number(args[0]) && args.length) {
        const searchTarget = args[0].toLowerCase();
        serverReplacements = serverReplacements.filter((r) =>
          r.replacement.toLowerCase().includes(searchTarget)
        );
        if (!serverReplacements.length)
          return msg.reply(`> You haven't set up anything to replace with \`${args[0]}\`.`);
      }
      const pages = createPages(serverReplacements, 8);
      const pageNumber = Number(args[0]) || 1;
      const currentPage = pages[pageNumber - 1];
      if (!serverReplacements.length)
        return msg.reply("> You haven't set up any replacements yet.");
      if (pageNumber < 0 || !currentPage)
        return msg.reply("> You didn't specify a valid page number.");
      const pageInfo = [`## Current Replacements [${serverReplacements.length}]`];
      for (let replacement of currentPage) {
        const server = client.guilds.cache.get(replacement.server);
        pageInfo.push(
          `- **Target: **\`${replacement.target}\` | **Replacement: **\`${
            replacement.replacement
          }\` | **Server: **\`${truncate(server.name, 35)}\``
        );
      }
      pageInfo.push(
        `### Showing Page ${pageNumber}/${pages.length}, type \`${prefix}replace <page number>\` for more pages.`
      );
      msg.reply(createList(pageInfo));
      return;
    }

    const target = args.shift();
    const replacement = args.join(" ");
    const replaceInfo = {
      target,
      replacement,
      server: msg.guild.id,
    };
    const serverReplacement = replacements.findIndex(
      (r) => r.server == msg.guild.id && r.target == target
    );
    if (serverReplacement < 0) replacements.push(replaceInfo);
    else {
      if (replacements[serverReplacement].replacement == replacement)
        return msg.reply(`> The phrase \`${target}\` already has that set as a replacement.`);
      replacements[serverReplacement] = replaceInfo;
      if (replacement.toLowerCase() == "remove") replacements.splice(serverReplacement, 1);
    }
    fs.writeFile("./json/replacements.json", JSON.stringify(replacements), (e) => {
      if (e) {
        msg.reply("> There was an error while setting a replacement. Check your console.");
        console.log(e);
        throw e;
      }
      if (isSubtle && msg.deletable) return msg.delete();
      msg.reply(`> The replacement for \`${target}\` has now been set to: \n > \`${replacement}\``);
    });
  },
};
