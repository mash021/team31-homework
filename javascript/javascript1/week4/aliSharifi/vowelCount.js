// 6kyu Vowel Count
function encode(string) {
    return string.replace(/[aeiou]/g, char => ({ 'a': '1', 'e': '2', 'i': '3', 'o': '4', 'u': '5' }[char]));
}

function decode(string) {
    return string.replace(/[1-5]/g, num => ({ '1': 'a', '2': 'e', '3': 'i', '4': 'o', '5': 'u' }[num]));
}

console.log(encode("HYF is the Best")); 

//Digit*Digit
function squareDigits(num) {
  return parseInt(
    num
      .toString()
      .split("")
      .map((digit) => Math.pow(parseInt(digit), 2))
      .join(""),
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
