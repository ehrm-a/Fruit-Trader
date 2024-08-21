const fs = require("fs");
const { prefix } = require("../../json/config.json");
const { capitalize, createList } = require("../../functions");

module.exports = {
  name: "Help",
  description: "Gives you the list of commands or the information of a specific command.",
  arguments: ["<command name>"],
  execute(client, msg, args) {
    const commandName = (args[0] || "").toLowerCase();
    const command = client.commands.get(commandName) || client.aliases.get(commandName);
    if (command) {
      const aliases = [];
      if (command.aliases) command.aliases.forEach((a) => aliases.push(`\`${a}\``));
      if (!command)
        return msg.reply(
          `> That wasn't a valid command. Do \`${prefix}help\` to see the full list.`
        );
      const arguments = command.arguments || [];
      if (!command.requiresArgs) arguments.unshift("");
      const commandInfo = [
        "## Command Information",
        `- **Name:** \`${command.name}\``,
        `- **Description:** \n >  - \`${command.description}\``,
        `- **Category:** \`${command.category}\``,
        `- **Aliases [${aliases.length}]:** ${aliases.join(", ") || "`None`"}`,
        `- **Requires Arguments:?** \`${command.requiresArgs ? "Yes" : "No"}\``,
        `- **During Trading?:** \`${command.duringTrading ? "Yes" : "No"}\``,
        `- **Arguments:**\n${createList(
          arguments,
          `>  - \`${prefix + command.name.toLowerCase()} `,
          "`",
          false
        )}`,
      ];
      msg.reply(createList(commandInfo));
      return;
    }
    const commandList = [`## Command List [${client.commands.size}]`];
    fs.readdirSync("./commands").forEach((c) => {
      const jsFiles = fs.readdirSync(`./commands/${c}`).filter((f) => f.endsWith(".js"));
      commandList.push(`- **${capitalize(c)} [${jsFiles.length}]**`);
      jsFiles.forEach((jsFile) => {
        const cmd = jsFile.split(".js")[0];
        const cmdName = require(`../${c}/${cmd}`).name;
        commandList.push(`  - \`${cmdName}\``);
      });
    });
    commandList.push(
      `### To see the information of a specific command, type \`${prefix}help <command name>\``
    );
    msg.reply(createList(commandList));
  },
};
