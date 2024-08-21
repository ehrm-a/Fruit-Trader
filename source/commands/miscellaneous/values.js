const { createList, capitalize } = require("../../functions");
const { prefix, fruitList, gamepassList } = require("../../json/config.json");
const puppeteer = require("puppeteer");

module.exports = {
  name: "Values",
  aliases: ["ValueList"],
  arguments: ["<blox fruit>", "perm <blox fruit>", "<gamepass>"],
  async execute(client, msg, args) {
    if (!args.length) {
      let fruitAmount = 0;
      Object.values(fruitList).forEach((i) => (fruitAmount = fruitAmount + i.length));
      const listMessage = ["## Blox Fruit Item List", `## Fruits [${fruitAmount}]`];
      for (const category in fruitList) {
        const fruits = [];
        fruitList[category].forEach((i) => fruits.push(`\`${capitalize(i)}\``));
        listMessage.push(
          `- **${capitalize(category)} [${fruits.length}]:**`,
          `  - ${fruits.join(", ")}`
        );
      }
      const gamepasses = [];
      gamepassList.forEach((i) => gamepasses.push(`\`${capitalize(i)}\``));
      listMessage.push(`## Gamepasses [${gamepasses.length}]`, `- ${gamepasses.join(", ")}`);
      msg.reply(createList(listMessage));
      return;
    }
    const isPerm = Boolean(args[0].toLowerCase() == "perm" ? args.shift() : "");
    const fruitCategory =
      Object.values(fruitList).find((i) => i.some((f) => f == args[0].toLowerCase())) || [];
    const selectedItem =
      gamepassList.find((i) => args[0].toLowerCase() == i) ||
      fruitCategory.find((f) => f == args[0].toLowerCase());
    if (!selectedItem)
      return msg.reply(
        `> The item \`${args[0].toLowerCase()}\` isn't a valid item. Do \`${prefix}valuelist\` to see all the available items.`
      );
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `https://bloxfruitsvalues.com/${fruitCategory.length ? "fruit" : "gamepasses"}/${capitalize(
        selectedItem
      ).replace(/ /g, "_")}`
    );
    if (isPerm) await page.select("select#types", "permanent");
    const itemInformation = await page.evaluate(() => {
      const card = document.querySelector("div.items-start");
      const data = {
        status: card.querySelector("h1.font-medium").innerText,
        value: card.querySelector("h2").innerText,
        demand: card.querySelectorAll("h2")[1].innerText,
        type: card.querySelectorAll("div.font-light")[2].innerText.split("\n")[1],
        image: card.querySelector("img").src,
        robux: card.querySelector("p.font-light").innerText,
        beli: card.querySelectorAll("p.font-light")[1].innerText,
      };
      return data;
    });
    const message = [
      "## Item Information",
      `- **Name:** \`${isPerm ? "Permanent " : ""}${capitalize(selectedItem)}\``,
    ];
    for (const k in itemInformation) {
      message.push(`- **${capitalize(k)}: ** \`${itemInformation[k]}\``);
    }
    msg.reply(createList(message));
  },
};
