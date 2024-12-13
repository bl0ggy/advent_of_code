import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');

function lookAndSay(s: string): string {
    let currentChar = s[0];
    let count = 0;
    let newS = '';
    for (let i = 0; i <= s.length; i++) {
        if (s[i] !== currentChar) {
            newS += `${count}${currentChar}`;
            count = 1;
            currentChar = s[i];
        } else {
            count++;
        }
    }
    return newS;
}
let newS = lines[0];
let lengthPart1 = newS.length;
let lengthPart2 = newS.length;
for (let i = 0; i < 50; i++) {
    newS = lookAndSay(newS);
    if (i == 39) {
        lengthPart1 = newS.length;
    } else if (i == 49) {
        lengthPart2 = newS.length;
    }
}

console.log('Part 1:', lengthPart1); // 252594
console.log('Part 2:', lengthPart2); // 3579328
