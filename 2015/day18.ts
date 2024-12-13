import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

function runGameOfLife(withStuckLight: boolean) {
    const cycles = 100;
    let grid: string[][] = lines.map((l) => l.split(''));
    let nextGrid: string[][] = [];
    if (withStuckLight) {
        grid[0][0] = '#';
        grid[0][grid[0].length - 1] = '#';
        grid[grid.length - 1][0] = '#';
        grid[grid.length - 1][grid[0].length - 1] = '#';
    }
    for (let cycle = 0; cycle < cycles; cycle++) {
        nextGrid = JSON.parse(JSON.stringify(grid));
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (
                    withStuckLight &&
                    (x === 0 && y === 0 || x === 0 && y === grid.length - 1 ||
                        x === grid[0].length - 1 && y === 0 ||
                        x === grid[0].length - 1 &&
                            y === grid.length - 1)
                ) {
                    continue;
                }

                let cellsAlive = 0;
                cellsAlive += y > 0 && x > 0 &&
                        grid[y - 1][x - 1] === '#'
                    ? 1
                    : 0;
                cellsAlive += y > 0 &&
                        grid[y - 1][x] === '#'
                    ? 1
                    : 0;
                cellsAlive += y > 0 && x + 1 < grid[y].length &&
                        grid[y - 1][x + 1] === '#'
                    ? 1
                    : 0;
                cellsAlive += x > 0 &&
                        grid[y][x - 1] === '#'
                    ? 1
                    : 0;
                cellsAlive += x + 1 < grid[y].length &&
                        grid[y][x + 1] === '#'
                    ? 1
                    : 0;
                cellsAlive += y + 1 < grid.length && x > 0 &&
                        grid[y + 1][x - 1] === '#'
                    ? 1
                    : 0;
                cellsAlive += y + 1 < grid.length &&
                        grid[y + 1][x] === '#'
                    ? 1
                    : 0;
                cellsAlive += y + 1 < grid.length && x + 1 < grid[y].length &&
                        grid[y + 1][x + 1] === '#'
                    ? 1
                    : 0;
                if (cellsAlive < 2 || cellsAlive > 3) {
                    nextGrid[y][x] = '.';
                } else if (cellsAlive === 3) {
                    nextGrid[y][x] = '#';
                }
            }
        }
        grid = nextGrid;
    }
    const lights = nextGrid.reduce(
        (yp: number, yv: string[]) =>
            yp +
            yv.reduce((xp: number, xv: string) => xp + (xv === '#' ? 1 : 0), 0),
        0,
    );
    return lights;
}

console.log('Part 1:', runGameOfLife(false)); // 1061
console.log('Part 2:', runGameOfLife(true)); // 1006
