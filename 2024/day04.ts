import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

let numberOfXmasPart1: number = 0;
let numberOfXmasPart2: number = 0;
const linesWidth = lines.length;
const linesHeight = lines[0].length;
for (let y = 0; y < linesHeight; y += 1) {
    for (let x = 0; x < linesWidth; x++) {
        if (lines[y][x] == 'X') {
            const enoughLeft = x - 3 >= 0;
            const enoughTop = y - 3 >= 0;
            const enoughRight = x + 3 < linesWidth;
            const enoughBottom = y + 3 < linesHeight;
            if (enoughLeft) {
                lines[y][x - 1] == 'M' && lines[y][x - 2] == 'A' &&
                    lines[y][x - 3] == 'S' && numberOfXmasPart1++;
            }
            if (enoughLeft && enoughTop) {
                lines[y - 1][x - 1] == 'M' && lines[y - 2][x - 2] == 'A' &&
                    lines[y - 3][x - 3] == 'S' && numberOfXmasPart1++;
            }
            if (enoughTop) {
                lines[y - 1][x] == 'M' && lines[y - 2][x] == 'A' &&
                    lines[y - 3][x] == 'S' && numberOfXmasPart1++;
            }
            if (enoughTop && enoughRight) {
                lines[y - 1][x + 1] == 'M' && lines[y - 2][x + 2] == 'A' &&
                    lines[y - 3][x + 3] == 'S' && numberOfXmasPart1++;
            }
            if (enoughRight) {
                lines[y][x + 1] == 'M' && lines[y][x + 2] == 'A' &&
                    lines[y][x + 3] == 'S' && numberOfXmasPart1++;
            }
            if (enoughRight && enoughBottom) {
                lines[y + 1][x + 1] == 'M' && lines[y + 2][x + 2] == 'A' &&
                    lines[y + 3][x + 3] == 'S' && numberOfXmasPart1++;
            }
            if (enoughBottom) {
                lines[y + 1][x] == 'M' && lines[y + 2][x] == 'A' &&
                    lines[y + 3][x] == 'S' && numberOfXmasPart1++;
            }
            if (enoughBottom && enoughLeft) {
                lines[y + 1][x - 1] == 'M' && lines[y + 2][x - 2] == 'A' &&
                    lines[y + 3][x - 3] == 'S' && numberOfXmasPart1++;
            }
        }
    }
}
for (let y = 1; y < linesHeight - 1; y += 1) {
    for (let x = 1; x < linesWidth - 1; x++) {
        if (lines[y][x] == 'A') {
            const tl = lines[y - 1][x - 1];
            const tr = lines[y - 1][x + 1];
            const bl = lines[y + 1][x - 1];
            const br = lines[y + 1][x + 1];

            tl == 'M' && tr == 'M' && br == 'S' && bl == 'S' &&
                numberOfXmasPart2++;
            tl == 'S' && tr == 'M' && br == 'M' && bl == 'S' &&
                numberOfXmasPart2++;
            tl == 'S' && tr == 'S' && br == 'M' && bl == 'M' &&
                numberOfXmasPart2++;
            tl == 'M' && tr == 'S' && br == 'S' && bl == 'M' &&
                numberOfXmasPart2++;
        }
    }
}
console.log('Part 1', numberOfXmasPart1); // 2578
console.log('Part 2', numberOfXmasPart2); // 1972
