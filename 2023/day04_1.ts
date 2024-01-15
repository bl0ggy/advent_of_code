import { data } from './day04_data';

let sum = 0;

data.split('\n')
.forEach((line) => {
    const [, numbersLine] = line.split(':');
    const [winningNumbersLine, myNumbersLine] = numbersLine.split('|');
    const winningNumbers = winningNumbersLine.replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10));
    const myNumbers = myNumbersLine.replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10));

    const correctNumbers = winningNumbers.filter((n) => myNumbers.includes(n)).length;
    if(correctNumbers > 0) {
        sum += 2 ** (correctNumbers - 1);
    }
});
console.log(sum); // 25651
