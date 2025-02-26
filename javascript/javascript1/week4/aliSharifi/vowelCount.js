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


//Digit*Digit
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

//7kyu Highest and Lowest
function minMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}

console.log(minMax([1, 2, 3, 4, 5])); // [1, 5]
console.log(minMax([2334454, 5])); // [5, 2334454]
console.log(minMax([1])); // [1, 1]
