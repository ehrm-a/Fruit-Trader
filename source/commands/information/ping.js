const { createList } = require("../../functions");

module.exports = {
  name: "Ping",
  description: "Gives you the latency of the client (Useful for checking if it's working).",
  aliases: ["Latency"],
  execute(client, msg) {
    msg.reply("> 🏓 Pong!").then((m) => {
      const pingInformation = [
        "🏓 Pong!",
        "------------",
        `Client: \`${m.createdTimestamp - msg.createdTimestamp}ms\``,
        `API: \`${client.ws.ping}ms\``,
      ];
      m.edit(createList(pingInformation));
    });
  },
};
