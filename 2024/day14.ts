import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();
const width = 101;
const height = 103;
const elapsedSeconds = 100;

type Vector = { x: number; y: number };

function compute(elapsed: number): Vector[] {
    const botsPositions: Vector[] = [];
    for (const l of lines) {
        const match = l.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
        if (match === null) {
            console.log(`Wrong input "${l}"`);
            process.exit(1);
        }
        const px = parseInt(match[1]);
        const py = parseInt(match[2]);
        const vx = parseInt(match[3]);
        const vy = parseInt(match[4]);
        const pos = {
            x: (px + vx * elapsed) % width,
            y: (py + vy * elapsed) % height,
        };
        if (pos.x < 0) pos.x += width;
        if (pos.y < 0) pos.y += height;
        botsPositions.push(pos);
    }
    return botsPositions;
}
function countQuadrants(botsPositions: Vector[]) {
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    for (const bot of botsPositions) {
        const isLeft = bot.x <= Math.floor(width / 2) - 1;
        const isRight = bot.x >= Math.ceil(width / 2);
        const isTop = bot.y <= Math.floor(height / 2) - 1;
        const isBottom = bot.y >= Math.ceil(height / 2);
        if (isTop && isLeft) {
            topLeft++;
        }
        if (isTop && isRight) {
            topRight++;
        }
        if (isBottom && isLeft) {
            bottomLeft++;
        }
        if (isBottom && isRight) {
            bottomRight++;
        }
    }
    return { topLeft, topRight, bottomLeft, bottomRight };
}

const part1 = countQuadrants(compute(elapsedSeconds));
console.log(
    'Part 1:',
    part1.topLeft * part1.topRight * part1.bottomLeft * part1.bottomRight,
); // 226179492

function makeGrid(botsPositions: Vector[]): number[][] {
    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
        grid.push([]);
        for (let x = 0; x < width; x++) {
            grid[y].push(0);
        }
    }
    for (const bot of botsPositions) {
        grid[bot.y][bot.x] += 1;
    }
    return grid;
}
function gridToText(grid: number[][]) {
    let txt = '';
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            txt += grid[y][x] === 0 ? ' ' : '0';
        }
        txt += '\n';
    }
    return txt;
}
function hasBotsLine(txt: string) {
    return txt.match(/0000000000000000000000000000000/g);
}
function findTree() {
    for (let i = 0;; i++) {
        const grid = makeGrid(compute(i));
        if (hasBotsLine(gridToText(grid))) {
            return i;
        }
    }
}
console.log('Part 2:', findTree()); // 7502
