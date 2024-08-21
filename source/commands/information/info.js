const { createList } = require("../../functions");
const { version, prefix } = require("../../json/config.json");

module.exports = {
  name: "Info",
  description: "Gives you important information about the client.",
  aliases: ["Information"],
  execute(client, msg) {
    const introduction = [
      `1. To get started, use the \`${prefix}settrade\` command to set up new trades for the channels you want to send messages in.`,
      `2. To see all of the trades you have set up, use the \`${[prefix]}trades\` command.`,
      `3. After you have set up your trades, you can start sending them by using the \`${prefix}sendtrades\` command.`,
      `4. When you are done trading, you can use the \`${prefix}stoptrades\` command to stop all of your trades.`,
      `5. To set up words you want to replace with certain emotes or phrases, use the \`${prefix}replace\` command.`,
      `6. For more information, use the \`${prefix}help <command name>\` to see more useful tips on how to use a specific command.`,
    ];
    const usefulTips = [
      "You can use the keyword `here` for some commands to refer to the channel you are in.",
      "You can individually use the subtle mode for some command by typing `-s` anywhere in the arguments.",
      "It's advised to create a private server only for this bot to avoid being spotted using the commands.",
    ];
    const botInformation = [
      "## Fruit-Trader | Information",
      `Hello **${client.user.username}**!`,
      `- Welcome to **Fruit-Trader**, here's a quick guide on how to use it!\n${createList(
        introduction,
        ">  "
      )}`,
      `- **Useful Tips:** \n${createList(usefulTips, ">  - ")}`,
      `- **Current Version:** \`v${version}\``,
      "- **Created By:** [`ehrm_a`](<https://github.com/ehrm-a>)",
    ];
    msg.reply({
      content: createList(botInformation),
      files: ["./images/iconSmall.png"],
    });
  },
};
