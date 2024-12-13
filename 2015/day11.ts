import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');

function isCorrect(s: string): boolean {
    if (s.match(/i|l|o/)) {
        return false;
    }
    if (!s.match(/(.)\1.*(.(?!\1))\2/)) {
        return false;
    }
    if (
        !s.match(/abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/)
    ) {
        return false;
    }
    return true;
}
function increase(s: string): string {
    // 'a' is 97, 'i' is 105, 'l' is 108, 'o' is 111, 'z' is 122
    const charCodes = s.split('').map((c) => c.charCodeAt(0));
    for (let i = charCodes.length - 1; i >= 0; i--) {
        charCodes[i]++;
        if (charCodes[i] <= 122) {
            if (
                charCodes[i] == 105 || charCodes[i] == 108 ||
                charCodes[i] == 111
            ) {
                charCodes[i]++;
            }
            break;
        }
        charCodes[i] = 97;
    }
    return charCodes.map((c) => String.fromCharCode(c)).join('');
}
function findNext(s: string) {
    let p = s;
    while (!isCorrect(p)) {
        p = increase(p);
    }
    return p;
}
const passwordPart1 = findNext(lines[0]);
const passwordPart2 = findNext(increase(passwordPart1));

console.log('Part 1:', passwordPart1); // vzbxxyzz
console.log('Part 2:', passwordPart2); // vzcaabcc
