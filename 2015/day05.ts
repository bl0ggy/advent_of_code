import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

let niceLinesPart1 = 0, niceLinesPart2 = 0;
for (const line of lines) {
    const hasDoubleChar = line.match(/(.)\1/);
    const hasAbCdPqXy = line.match(/ab|cd|pq|xy/);
    const has3vowels = line.matchAll(/a|e|i|o|u/g).toArray().length >= 3;
    hasDoubleChar && !hasAbCdPqXy && has3vowels && niceLinesPart1++;

    const hasRepeatedPair = line.match(/([a-zA-Z])([a-zA-Z]).*\1\2/);
    const hasCharSeparated = line.match(/([a-z]).\1/);
    hasRepeatedPair && hasCharSeparated && niceLinesPart2++;
}

console.log('Part 1:', niceLinesPart1); // 238
console.log('Part 2:', niceLinesPart2); // 69
