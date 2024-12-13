import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = JSON.parse(
    fs
        .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
        .toString(),
);

function isInt(o: unknown): o is number {
    return Number.isInteger(o);
}
function hasRed(o: object) {
    return Object.values(o).includes('red');
}

function browse(o: unknown, ignoreRed: boolean): number {
    let sum = 0;
    if (typeof o !== 'object' || o === null) {
        return 0;
    }
    for (const val of Object.values(o)) {
        // console.log(key, val);
        if (val === null) {
            continue;
        }
        if (isInt(val)) {
            sum += val;
        } else if (typeof val === 'object') {
            if (Array.isArray(val) || !ignoreRed || !hasRed(val)) {
                sum += browse(val, ignoreRed);
            }
        }
    }
    return sum;
}

console.log('Part 1:', browse(lines, false)); // 119433
console.log('Part 2:', browse(lines, true)); // 68466
