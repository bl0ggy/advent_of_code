import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

let result = lines
    .map((line: string) => {
        const first = line.match(/^[^0-9]*([0-9])/);
        const last = line.match(/([0-9])[^0-9]*$/);
        if (!first || !last) throw new Error('Input missing number');

        const concat = first[1] + last[1];
        return parseInt(concat, 10);
    })
    .reduce((a: number, b: number) => a + b);
console.log('Part 1:', result); // 54159

const literalNumbers = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
];
function toNumericalString(str: string): string {
    const index = literalNumbers.indexOf(str);
    if (index >= 0) return `${index}`;
    return str;
}

const regexFirst =
    /^.*?([0-9]|zero|one|two|three|four|five|six|seven|eight|nine|ten).*$/;
const regexLast =
    /^.*([0-9]|zero|one|two|three|four|five|six|seven|eight|nine|ten).*$/;
result = lines
    .map((line: string) => {
        const first = line.match(regexFirst);
        const last = line.match(regexLast);
        if (!first || !last) throw new Error('Input missing number');

        const concat = toNumericalString(first[1]) + toNumericalString(last[1]);
        return parseInt(concat, 10);
    })
    .reduce((a: number, b: number) => a + b);
console.log('Part 2:', result); // 53866
