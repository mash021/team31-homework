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


//digit dogits
function squareDigits(num) {
    return parseInt(
        num.toString()
            .split('')
            .map(digit => Math.pow(parseInt(digit), 2))
            .join(''),
        10
    );
}

console.log(squareDigits(9349)); 
console.log(squareDigits(865)); 
