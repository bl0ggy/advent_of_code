import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const [grid_, moves_] = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n\n');
const gridPart1 = grid_.split('\n').map((l) => l.split(''));
const moves = moves_.split('\n').slice(0, -1).join('');

type Vector = { x: number; y: number };

function findRobot(grid: string[][]) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === '@') {
                return { x, y };
            }
        }
    }
    throw new Error('Missing robot');
}
let currentPos: Vector = findRobot(gridPart1);

function moveRobotPart1(
    grid: string[][],
    pos: Vector,
    direction: Vector,
): boolean {
    const nextPos = { x: pos.x + direction.x, y: pos.y + direction.y };
    let tmp: string;
    switch (grid[nextPos.y][nextPos.x]) {
        case '#':
            return false;
        case '.':
            tmp = grid[nextPos.y][nextPos.x];
            grid[nextPos.y][nextPos.x] = grid[pos.y][pos.x];
            grid[pos.y][pos.x] = tmp;
            return true;
        case 'O':
            if (
                moveRobotPart1(grid, nextPos, direction)
            ) {
                tmp = grid[nextPos.y][nextPos.x];
                grid[nextPos.y][nextPos.x] = grid[pos.y][pos.x];
                grid[pos.y][pos.x] = tmp;
                return true;
            }
            return false;
    }
    return false;
}
function drawGrid(grid: string[][]) {
    console.log(grid.map((l) => l.join('')).join('\n'));
}

for (const move of moves) {
    const direction: Vector = { x: 0, y: 0 };
    switch (move) {
        case '<':
            direction.x = -1;
            break;
        case '^':
            direction.y = -1;
            break;
        case '>':
            direction.x = 1;
            break;
        case 'v':
            direction.y = 1;
            break;
    }
    if (moveRobotPart1(gridPart1, currentPos, direction)) {
        currentPos.x += direction.x;
        currentPos.y += direction.y;
    }
}
let gpsSumPart1 = 0;
for (let y = 0; y < gridPart1.length; y++) {
    for (let x = 0; x < gridPart1[0].length; x++) {
        if (gridPart1[y][x] === 'O') {
            gpsSumPart1 += 100 * y + x;
        }
    }
}

const gridPart2 = grid_.replaceAll('#', '##').replaceAll('O', '[]').replaceAll(
    '.',
    '..',
).replace('@', '@.').split('\n').map((l) => l.split(''));
function moveRobotPart2(
    grid: string[][],
    pos: Vector,
    direction: Vector,
    checkOnly: boolean,
): boolean {
    const nextPos = { x: pos.x + direction.x, y: pos.y + direction.y };
    let tmp: string;
    const updown = direction.y !== 0;
    switch (grid[nextPos.y][nextPos.x]) {
        case '#':
            return false;
        case '.':
            if (!checkOnly) {
                tmp = grid[nextPos.y][nextPos.x];
                grid[nextPos.y][nextPos.x] = grid[pos.y][pos.x];
                grid[pos.y][pos.x] = tmp;
            }
            return true;
        case '[':
        case ']':
            if (updown) {
                const otherBoxSide: Vector = { x: nextPos.x, y: nextPos.y };
                if (grid[nextPos.y][nextPos.x] === '[') {
                    otherBoxSide.x += 1;
                } else {
                    otherBoxSide.x -= 1;
                }

                if (
                    moveRobotPart2(grid, nextPos, direction, checkOnly) &&
                    moveRobotPart2(grid, otherBoxSide, direction, checkOnly)
                ) {
                    if (!checkOnly) {
                        tmp = grid[nextPos.y][nextPos.x];
                        grid[nextPos.y][nextPos.x] = grid[pos.y][pos.x];
                        grid[pos.y][pos.x] = tmp;
                    }
                    return true;
                }
                return false;
            } else {
                if (
                    moveRobotPart2(grid, nextPos, direction, checkOnly)
                ) {
                    if (!checkOnly) {
                        tmp = grid[nextPos.y][nextPos.x];
                        grid[nextPos.y][nextPos.x] = grid[pos.y][pos.x];
                        grid[pos.y][pos.x] = tmp;
                    }
                    return true;
                }
                return false;
            }
    }
    return false;
}
currentPos = findRobot(gridPart2);
for (const move of moves) {
    const direction: Vector = { x: 0, y: 0 };
    switch (move) {
        case '<':
            direction.x = -1;
            break;
        case '^':
            direction.y = -1;
            break;
        case '>':
            direction.x = 1;
            break;
        case 'v':
            direction.y = 1;
            break;
    }
    if (moveRobotPart2(gridPart2, currentPos, direction, true)) {
        moveRobotPart2(gridPart2, currentPos, direction, false);
        currentPos.x += direction.x;
        currentPos.y += direction.y;
    }
}

let gpsSumPart2 = 0;
for (let y = 0; y < gridPart2.length; y++) {
    for (let x = 0; x < gridPart2[0].length; x++) {
        if (gridPart2[y][x] === '[') {
            gpsSumPart2 += 100 * y + x;
        }
    }
}
console.log('Part 1:', gpsSumPart1); // 1511865
console.log('Part 2:', gpsSumPart2); // 1519991
