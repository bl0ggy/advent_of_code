import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

enum Direction {
    Up,
    Right,
    Down,
    Left,
}
let startX = 0, startY = 0;
const startDirection: Direction = Direction.Up;
for (const [i, line] of lines.entries()) {
    const match = line.match(/\^/);
    if (match) {
        startY = i;
        startX = match.index!;
        break;
    }
}
const grid = lines.map((l) => l.split(''));
grid[startY][startX] = '.';

function runSimulation(
    grid: string[][],
    withObstruction: boolean,
): number | boolean {
    let totalPositions = 0;
    let x = startX, y = startY, direction = startDirection;
    const positionPassCount: Map<string, number> = new Map();
    while (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
        const currentPosition = grid[y][x];
        if (currentPosition === '.') {
            totalPositions++;
            if (!withObstruction) {
                grid[y][x] = 'x';
            }
        }

        let nextX: number = 0;
        let nextY: number = 0;
        let nextDirection: Direction = Direction.Up;
        switch (direction) {
            case Direction.Up:
                nextX = x;
                nextY = y - 1;
                nextDirection = Direction.Right;
                break;
            case Direction.Right:
                nextX = x + 1;
                nextY = y;
                nextDirection = Direction.Down;
                break;
            case Direction.Down:
                nextX = x;
                nextY = y + 1;
                nextDirection = Direction.Left;
                break;
            case Direction.Left:
                nextX = x - 1;
                nextY = y;
                nextDirection = Direction.Up;
                break;
        }
        if (
            !(nextX >= 0 && nextX < grid[0].length && nextY >= 0 &&
                nextY < grid.length)
        ) {
            break;
        }
        const nextPosition = grid[nextY][nextX];
        if (nextPosition === '#' || nextPosition === 'O') {
            direction = nextDirection;
            const key = `${nextX},${nextY}`;
            if (!positionPassCount.has(key)) {
                positionPassCount.set(key, 0);
            }
            const val = (positionPassCount.get(key) as number) + 1;
            if (val > 4) { // A single "wall" can be hit for 4 sides, if it gets touched more than 4 times it means we are looping
                return true;
            } else {
                positionPassCount.set(key, val);
            }
        } else if (currentPosition === '.' || currentPosition === 'x') {
            x = nextX;
            y = nextY;
        }
    }
    if (withObstruction) {
        return false;
    } else {
        return totalPositions;
    }
}

console.log('Part 1', runSimulation(grid, false)); // 5551
let totalObstructions = 0;
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if (x === startX && y === startY) {
            continue;
        }
        if (grid[y][x] === 'x') {
            grid[y][x] = 'O';
            if (runSimulation(grid, true)) {
                totalObstructions++;
            }
            grid[y][x] = 'x';
        }
    }
}
console.log('Part 2', totalObstructions); // 1939
