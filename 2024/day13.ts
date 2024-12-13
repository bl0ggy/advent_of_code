import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const blocks = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n\n').map((b) => b.split('\n'));
blocks[blocks.length - 1].pop();

let totalCoinsUsedPart1 = 0, totalCoinsUsedPart2 = 0;
for (const block of blocks) {
    const matchA = block[0].match(/X\+(\d+).*Y\+(\d+)/);
    const matchB = block[1].match(/X\+(\d+).*Y\+(\d+)/);
    const matchP = block[2].match(/X=(\d+).*Y=(\d+)/);
    const Ax = parseInt(matchA![1]);
    const Ay = parseInt(matchA![2]);
    const Bx = parseInt(matchB![1]);
    const By = parseInt(matchB![2]);
    const Px = parseInt(matchP![1]);
    const Py = parseInt(matchP![2]);
    let x = (Bx * Py - By * Px) / (Ay * Bx - Ax * By);
    let y = (Ax * Py - Ay * Px) / (Ax * By - Ay * Bx);
    if (Math.round(x) === x && Math.round(y) === y && x <= 100 && y <= 100) {
        totalCoinsUsedPart1 += 3 * x + y;
    }
    x = (Bx * (Py + 10000000000000) - By * (Px + 10000000000000)) /
        (Ay * Bx - Ax * By);
    y = (Ax * (Py + 10000000000000) - Ay * (Px + 10000000000000)) /
        (Ax * By - Ay * Bx);
    if (Math.round(x) === x && Math.round(y) === y) {
        totalCoinsUsedPart2 += 3 * x + y;
    }
}

console.log('Part 1:', totalCoinsUsedPart1); // 39996
console.log('Part 2:', totalCoinsUsedPart2); // 73267584326867

// The Maths:
// a = Ax
// b = Ay
// c = Bx
// d = By
//
// X = xa + yc
// Y = xb + yd
//
// Find x:
// X => y = (X - xa) / c
// Y = xb + (X - xa)d / c
// cY = xbc + dX - xad
// cY = x(bc - ad) + dX
// x = (cY - dX) / (bc - ad)
//
// Find y:
// X => x = (X - yc) / a
// Y = yd + (X - yc)b / a
// aY = yad + bX - ybc
// aY = bX + y(ad - bc)
// y = (aY - bX) / (ad - bc)
//
// Example:
// const X = 8400;
// const Y = 5400;
// const a = 94;
// const b = 34;
// const c = 22;
// const d = 67;
// console.log('x=', (c * Y - d * X) / (b * c - a * d));
// console.log('y=', (a * Y - b * X) / (a * d - b * c));
