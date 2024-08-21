const { capitalize } = require("../../functions");
const config = require("../../json/config.json");
const fs = require("fs");

module.exports = {
  name: "SetMode",
  description:
    "Shows the client's selected mode or changes it a different one. Subtle is enabled by default and is meant to delete messages of specific commands after using them (Useful for making the client undetectable).",
  aliases: ["Mode"],
  arguments: ["<normal or subtle>"],
  execute(client, msg, args) {
    if (!args.length)
      return msg.reply(`> The current client's mode is set to: \`${capitalize(config.mode)}\``);
    const modes = ["normal", "subtle"];
    const newMode = modes.find((m) => m == args[0].toLowerCase());
    if (!newMode)
      return msg.reply(
        `You didn't specify a valid client mode. The available modes are: \`${modes.join(", ")}\``
      );
    config.mode = newMode;
    fs.writeFile("./json/config.json", JSON.stringify(config), (e) => {
      if (e) {
        msg.reply("> There was an error while changing the mode. Check your console.");
        console.log(e);
        throw e;
      }
      msg.reply(`> The client's mode has been set to: \`${capitalize(newMode)}\``);
    });
  },
};
