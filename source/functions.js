module.exports = {
  capitalize(oldString = String()) {
    const newString = [];
    oldString
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .split(" ")
      .forEach((word) => {
        const capitalizedWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
        newString.push(capitalizedWord);
      });
    return newString.join(" ");
  },

  createList(array = Array(), beginning = "> ", ending = String(), ignoreEmpty = true) {
    const listItem = [];
    for (item of array) {
      if (!item && ignoreEmpty) continue;
      listItem.push(`${beginning}${item}${ending}`);
    }
    return listItem.join("\n");
  },

  createPages(array = Array(), items = 5) {
    const separatedArray = [];
    for (i = 0; i < array.length; i += items) {
      const page_items = array.slice(i, i + items);
      separatedArray.push(page_items);
    }
    return separatedArray;
  },

  truncate(string = String(), length = 10, ending = "...") {
    let newString = string;
    if (string.length >= length) newString = string.slice(0, length - ending.length) + ending;
    return newString;
  },

  orderAlphabetically(string1 = String(), string2 = String()) {
    if (string1 < string2) return -1;
    if (string1 > string2) return 1;
    return 0;
  },
};
