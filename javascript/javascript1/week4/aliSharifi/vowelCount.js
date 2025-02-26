function countVowels(str) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;

  str.split("").forEach((char) => {
    if (vowels.has(char)) {
      count++;
    }
  });

  return `The number of vowels in the given text is: ${count}`;
}

console.log(countVowels("Hack your future is awesome"));
