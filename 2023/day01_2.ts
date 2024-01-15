import { data } from './day01_data';

const literalNumbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
function toNumericalString(str: string) : string {
    const index = literalNumbers.indexOf(str);
    if(index >= 0) return `${index}`;
    return str;
}

const regexFirst = /^.*?([0-9]|zero|one|two|three|four|five|six|seven|eight|nine|ten).*$/;
const regexLast = /^.*([0-9]|zero|one|two|three|four|five|six|seven|eight|nine|ten).*$/;
const result = data.split('\n')
.map((line) => {
    const first = line.match(regexFirst);
    const last = line.match(regexLast);
    if(!first || !last) throw new Error('Input missing number');

    const concat = toNumericalString(first[1]) + toNumericalString(last[1]);
    return parseInt(concat, 10);
})
.reduce((a, b) => a + b);
console.log(result); // 53866
