import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n')
    .map((l) => l.split(''));
lines.pop();

class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toKey() {
        return `${this.y},${this.x}`;
    }
}
function addVector(a: Vector, b: Vector) {
    return new Vector(
        a.x + b.x,
        a.y + b.y,
    );
}
function subtractVector(a: Vector, b: Vector) {
    return new Vector(
        a.x - b.x,
        a.y - b.y,
    );
}
function checkPosition(pos: Vector) {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

const width = lines[0].length;
const height = lines.length;
const antennaToPosition: Map<string, Vector[]> = new Map();
const positionToAntenna: Map<string, string> = new Map();
const antinodes: Set<string> = new Set();
const antinodeHarmonics: Set<string> = new Set();
for (const [y, line] of lines.entries()) {
    for (const [x, char] of line.entries()) {
        if (char === '.' || char === '#') {
            continue;
        }
        positionToAntenna.set(`${y},${x}`, char);
        if (!antennaToPosition.has(char)) {
            antennaToPosition.set(char, []);
        }
        antennaToPosition.get(char)!.push(new Vector(x, y));
    }
}
for (const positions of antennaToPosition.values()) {
    for (const [i, pos1] of positions.entries()) {
        if (checkPosition(pos1)) {
            antinodeHarmonics.add(pos1.toKey());
        }
        for (const pos2 of positions.slice(i + 1)) {
            const diff = subtractVector(pos2, pos1);
            let antinode1 = subtractVector(pos1, diff);
            let antinode2 = addVector(pos2, diff);
            if (checkPosition(antinode1)) {
                antinodes.add(antinode1.toKey());
            }
            if (checkPosition(antinode2)) {
                antinodes.add(antinode2.toKey());
            }
            while (checkPosition(antinode1)) {
                antinodeHarmonics.add(antinode1.toKey());
                antinode1 = subtractVector(antinode1, diff);
            }
            while (checkPosition(antinode2)) {
                antinodeHarmonics.add(antinode2.toKey());
                antinode2 = addVector(antinode2, diff);
            }
        }
    }
}

console.log('Part 1:', antinodes.size); // 318
console.log('Part 2:', antinodeHarmonics.size); // 1126
