import fs from 'node:fs';
import path from 'node:path';

type char = '^' | '<' | '>' | 'v';
const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const line = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('') as char[];

let xPart1 = 0, yPart1 = 0;
let xSanta = 0, ySanta = 0, xRobot = 0, yRobot = 0;
const visitedHousesPart1: Map<string, boolean> = new Map();
visitedHousesPart1.set(`0x0`, true);
const visitedHousesPart2: Map<string, boolean> = new Map();
visitedHousesPart2.set(`0x0`, true);
for (const [i, c] of line.entries()) {
    switch (c) {
        case '^':
            yPart1++;
            break;
        case 'v':
            yPart1--;
            break;
        case '<':
            xPart1--;
            break;
        case '>':
            xPart1++;
            break;
    }
    const keyPart1 = `${xPart1}x${yPart1}`;
    if (!visitedHousesPart1.has(keyPart1)) {
        visitedHousesPart1.set(keyPart1, true);
    }

    switch (c) {
        case '^':
            i % 2 ? ySanta++ : yRobot++;
            break;
        case 'v':
            i % 2 ? ySanta-- : yRobot--;
            break;
        case '<':
            i % 2 ? xSanta-- : xRobot--;
            break;
        case '>':
            i % 2 ? xSanta++ : xRobot++;
            break;
    }
    let keyPart2: string;
    if (i % 2) {
        keyPart2 = `${xSanta}x${ySanta}`;
    } else {
        keyPart2 = `${xRobot}x${yRobot}`;
    }
    if (!visitedHousesPart2.has(keyPart2)) {
        visitedHousesPart2.set(keyPart2, true);
    }
}
console.log('Part 1:', visitedHousesPart1.size); // 2565
console.log('Part 2:', visitedHousesPart2.size); // 2639
