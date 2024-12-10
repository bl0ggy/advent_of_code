import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const grid = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n')
    .map((l) => l.split('').map((c) => parseInt(c)));
grid.pop();

const uniqueTrailHeads: Set<`${number},${number}x${number},${number}`> =
    new Set();
let totalPaths = 0;

function findTrailHead(
    startX: number,
    startY: number,
    x: number,
    y: number,
    height: number,
) {
    if (height === 9) {
        uniqueTrailHeads.add(`${startX},${startY}x${x},${y}`);
        totalPaths++;
        return;
    }
    const heightP1 = height + 1;
    if (0 <= y - 1 && grid[y - 1][x] === height + 1) {
        findTrailHead(startX, startY, x, y - 1, heightP1);
    }
    if (0 <= x - 1 && grid[y][x - 1] === height + 1) {
        findTrailHead(startX, startY, x - 1, y, heightP1);
    }
    if (y + 1 < grid.length && grid[y + 1][x] === height + 1) {
        findTrailHead(startX, startY, x, y + 1, heightP1);
    }
    if (x + 1 < grid[0].length && grid[y][x + 1] === height + 1) {
        findTrailHead(startX, startY, x + 1, y, heightP1);
    }
}

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === 0) {
            findTrailHead(x, y, x, y, 0);
        }
    }
}

console.log('Part 1:', uniqueTrailHeads.size); // 796
console.log('Part 2:', totalPaths); // 1942
