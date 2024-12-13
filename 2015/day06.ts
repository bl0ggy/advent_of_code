import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

enum Type {
    TurnOn,
    TurnOff,
    Toggle,
}
type coordinateString = `${number}x${number}`;
type gridType = Map<coordinateString, number>;

const gridPart1: gridType = new Map();
const gridPart2: gridType = new Map();
for (let line of lines) {
    let type: Type;
    const range: {
        p1: { x: number; y: number };
        p2: { x: number; y: number };
    } = { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } };
    if (line.startsWith('turn on')) {
        line = line.substring(8);
        type = Type.TurnOn;
    } else if (line.startsWith('turn off')) {
        line = line.substring(9);
        type = Type.TurnOff;
    } else {
        line = line.substring(7);
        type = Type.Toggle;
    }
    const points = line.split(' through ').map((p) => p.split(','));
    range.p1.x = parseInt(points[0][0]);
    range.p1.y = parseInt(points[0][1]);
    range.p2.x = parseInt(points[1][0]);
    range.p2.y = parseInt(points[1][1]);

    for (let y = range.p1.y; y <= range.p2.y; y++) {
        for (let x = range.p1.x; x <= range.p2.x; x++) {
            const key: coordinateString = `${x}x${y}`;
            if (!gridPart1.has(key)) {
                gridPart1.set(key, 0);
            }
            if (!gridPart2.has(key)) {
                gridPart2.set(key, 0);
            }
            switch (type) {
                case Type.TurnOn:
                    gridPart1.set(key, 1);
                    gridPart2.set(key, gridPart2.get(key)! + 1);
                    break;
                case Type.TurnOff:
                    gridPart1.set(key, 0);
                    gridPart2.set(key, Math.max(0, gridPart2.get(key)! - 1));
                    break;
                case Type.Toggle:
                    gridPart1.set(key, gridPart1.get(key) === 1 ? 0 : 1);
                    gridPart2.set(key, gridPart2.get(key)! + 2);
                    break;
            }
        }
    }
}
const lightsTurnedOn =
    gridPart1.values().filter((v) => v === 1).toArray().length;
const lightsBrightness = gridPart2.values().reduce((p, v) => p + v, 0);
// Print gridPart2
// for (let x = 0; x <= 5; x++) {
//     let line = '';
//     for (let y = 0; y <= 5; y++) {
//         if (gridPart2.has(`${x}x${y}`)) {
//             line += gridPart2.get(`${x}x${y}`);
//         } else {
//             line += '0';
//         }
//     }
//     console.log(line);
// }

console.log('Part 1:', lightsTurnedOn); // 543903
console.log('Part 2:', lightsBrightness); // 14687245
