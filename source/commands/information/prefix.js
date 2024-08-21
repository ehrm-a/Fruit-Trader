const fs = require("fs");
const config = require("../../json/config.json");

module.exports = {
  name: "Prefix",
  description: "Shows the current prefix or updates it to a new one.",
  aliases: ["SetPrefix"],
  arguments: ["<new prefix>"],
  execute(client, msg, args) {
    if (!args.length) return msg.reply(`> The clien'ts current prefix is: \`${config.prefix}\``);
    const newPrefix = args.join(" ");
    config.prefix = newPrefix;
    fs.writeFile("./json/config.json", JSON.stringify(config), (e) => {
      if (e) {
        msg.reply("> There was an error while changing the client's prefix. Check your console.");
        console.log(e);
        throw e;
      }
      msg.reply(`> The prefix has been changed to: \`${newPrefix}\``);
    });
  },
};
