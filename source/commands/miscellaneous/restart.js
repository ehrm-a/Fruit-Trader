module.exports = {
  name: "Restart",
  description:
    "Restarts the client and stops whatever it's doing (Useful for experiencing issues or high latency).",
  duringTrading: false,
  execute(client, msg) {
    const options = ["y", "yes", "n", "no"];
    const getOption = (str) => options.find((o) => o == str.toLowerCase());
    const msgCollector = msg.channel.createMessageCollector({
      filter: (m) => m.author.id == msg.author && Boolean(getOption(m.content)),
      time: 60000,
      max: 1,
    });
    msg.reply(
      "> Are you sure you want to completely restart the bot? This will stop ANYTHING currently going on. `Y/N`"
    );
    msgCollector.on("collect", (m) => {
      if (options.indexOf(getOption(m.content)) >= 2) return msgCollector.stop("Declined");
      msg.reply("> The bot will restart in `5 seconds...`");
      setTimeout(() => {
        process.on("exit", () => {
          require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
          });
        });
        process.exit();
      }, 5000);
    });
    msgCollector.on("end", (c, reason) => {
      if (reason == "Declined") msg.reply("> This operation has been declined.");
    });
  },
};
