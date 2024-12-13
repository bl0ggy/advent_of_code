import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const line: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n')[0];

let min5zeroes = -1, min6zeroes = -1;
for (let i = 0;; i++) {
    const hash = crypto.createHash('md5').update(`${line}${i}`).digest('hex');
    if (min5zeroes == -1 && hash.substring(0, 5) === '00000') {
        min5zeroes = i;
    }
    if (min6zeroes == -1 && hash.substring(0, 6) === '000000') {
        min6zeroes = i;
    }
    if (min5zeroes >= 0 && min6zeroes >= 0) {
        break;
    }
}

console.log('Part 1:', min5zeroes); // 346386
console.log('Part 2:', min6zeroes); // 9958218
