const fs = require("fs");
const ms = require("ms");
const { prefix } = require("../../json/config.json");
const cooldowns = require("../../json/cooldowns.json");
const { createList, createPages } = require("../../functions");

module.exports = {
  name: "SetCooldown",
  description:
    "Sets up the cooldown or how long it takes for each trade to be sent into their corresponding channel (Longer and different times are useful for bypassing detection).",
  aliases: ["Cooldown", "SetRateLimit"],
  duringTrading: false,
  arguments: ["<page number>", "<channel> <cooldown>"],
  execute(client, msg, args) {
    if (!args.length || args[0].length == 1) {
      if (!cooldowns.length) return msg.reply("> You don't have any channel cooldowns to show.");
      const pages = createPages(cooldowns, 10);
      const pageNumber = Number(args[0]) || 1;
      const currentPage = pages[pageNumber - 1];
      if (pageNumber < 0 || !currentPage)
        return msg.reply("> You didn't specify a valid page number.");
      const pageInfo = [`## Current Channel Cooldowns [${cooldowns.length}]`];
      for (const channelCD of currentPage) {
        const channel = client.channels.cache.get(channelCD.id);
        if (!channel) continue;
        pageInfo.push(
          `- **Channel:** ${channel} | **Cooldown:** \`${ms(channelCD.cooldown, { long: true })}\``
        );
      }
      pageInfo.push(
        `### Showing Page ${pageNumber}/${pages.length}, type \`${prefix}setcooldown <page number>\` for more pages.`
      );
      msg.reply(createList(pageInfo));
      return;
    }
    const channel = client.channels.cache.get(args.shift()) || msg.mentions.channels.first();
    if (!channel) return msg.reply("> You didn't specify a valid channel.");
    const cooldown = ms(args.join(" ") || 0);
    if (!cooldown || typeof cooldown == "string" || cooldown <= 1000)
      return msg.reply("> You didn't specify a valid cooldown.");
    if (cooldown <= channel.rateLimitPerUser * 1000)
      return msg.reply("> The channel cooldown can't be the same or lower than its slowmode.");
    const cdInfo = {
      id: channel.id,
      cooldown: cooldown,
    };
    const channelCD = cooldowns.findIndex((c) => c.id == cdInfo.id);
    if (channelCD < 0) cooldowns.push(cdInfo);
    else {
      if (cooldowns[channelCD].cooldown == cooldown)
        return msg.reply(
          `> The cooldown for the channel ${channel} has already been set to: \n > \`${ms(
            cooldown,
            { long: true }
          )}\``
        );
      cooldowns[channelCD] = cdInfo;
    }
    fs.writeFile("./json/cooldowns.json", JSON.stringify(cooldowns), (e) => {
      if (e) {
        console.log(e);
        msg.reply(
          "There was an error while changing the cooldown for that channel. Check your console."
        );
        throw e;
      }
      msg.reply(
        `> The cooldown for the channel ${channel} has been set to: \n > \`${ms(cooldown, {
          long: true,
        })}\``
      );
    });
  },
};
