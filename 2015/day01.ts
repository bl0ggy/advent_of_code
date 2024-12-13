import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const line: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const splitLine = line.split('');

let arrivalFloor = 0;
let positionBasement = 0;
for (const [i, c] of splitLine.entries()) {
    c === '(' && arrivalFloor++;
    c === ')' && arrivalFloor--;
    if (positionBasement === 0 && arrivalFloor == -1) {
        positionBasement = i + 1;
    }
}

console.log('Part 1:', arrivalFloor); // 74
console.log('Part 2:', positionBasement); // 1795
