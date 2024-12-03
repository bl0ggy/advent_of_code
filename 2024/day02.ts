import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

function testLine(list: number[]): boolean {
    let decreasing = true, increasing = true, inRange = true;
    for (let i = 0; i < list.length - 1; i++) {
        increasing &&= list[i] < list[i + 1];
        decreasing &&= list[i] > list[i + 1];
        const diff = Math.abs(list[i] - list[i + 1]);
        inRange &&= diff >= 1 && diff <= 3;
    }
    return inRange && (increasing || decreasing);
}
function testLine2(list: number[]): boolean {
    for (let i = 0; i < list.length; i++) {
        const newList = [...list.slice(0, i), ...list.slice(i + 1)];
        if (testLine(newList)) {
            return true;
        }
    }
    return false;
}

const valuess = lines.map((l) => l.split(' ').map((v) => parseInt(v, 10)));
let safePaths: number = 0;
for (let i = 0; i < valuess.length; i += 1) {
    if (testLine2(valuess[i])) {
        safePaths++;
    }
}
console.log('Part 1', safePaths); // 242

safePaths = 0;
for (let i = 0; i < valuess.length; i += 1) {
    if (testLine2(valuess[i])) {
        safePaths++;
    }
}
console.log('Part 2', safePaths); // 311
