const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(client, msg) {
    const { prefix, mode } = require("../json/config.json");
    if (
      !msg.content.startsWith(prefix) ||
      msg.author.id != client.user.id ||
      msg.channel.type == "DM"
    )
      return;
    const arguments = msg.content.slice(prefix.length).split(" ");
    const individualMode = arguments.findIndex((a) => a.toLowerCase() == "-s");
    let isSubtle = mode == "subtle";
    if (individualMode >= 0) {
      arguments.splice(individualMode, 1);
      isSubtle = true;
    }
    const commandName = arguments.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!command) return;
    if (command.duringTrading == false && client.trading) {
      if (isSubtle) {
        msg.delete();
        return console.log(
          `[${new Date().toLocaleTimeString()}] The action "${prefix}${
            command.name
          }" cannot be performed while trading.`
        );
      }
      return msg.reply(
        `> You cannot perform this command while you are trading. To stop, simply say \`${prefix}stoptrades\``
      );
    }
    if (command.requiresArgs && !arguments.length) {
      if (isSubtle) {
        msg.delete();
        return console.log(
          `[${new Date().toLocaleTimeString()}] The action "${prefix}${
            command.name
          }" requires arguments.`
        );
      }
      return msg.reply(
        `> That command requires arguments! Use \`${prefix}help\` for more information.`
      );
    }
    command.execute(client, msg, arguments, isSubtle);
  },
};
