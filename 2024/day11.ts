import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();
const stones = lines[0].split(' ').map((s) => parseInt(s));
console.log(stones);

const blinkMemo: Map<number, Map<number, number>> = new Map();
function blink(num: number, blinks: number): number {
    if (blinks <= 0) {
        return 1;
    }
    if (blinkMemo.has(num)) {
        const memo = blinkMemo.get(num);
        if (memo instanceof Map && memo.has(blinks)) {
            return memo.get(blinks)!;
        }
    } else {
        blinkMemo.set(num, new Map());
    }

    const memo = blinkMemo.get(num)!;
    let count = 0;
    if (num === 0) {
        count = blink(1, blinks - 1);
    } else if (num.toString().length % 2 == 0) {
        const s = num.toString();
        const [a, b] = [
            parseInt(s.slice(0, s.length / 2)),
            parseInt(s.slice(s.length / 2)),
        ];
        count = blink(a, blinks - 1) + blink(b, blinks - 1);
    } else {
        count = blink(num * 2024, blinks - 1);
    }
    if (!memo.has(blinks)) {
        memo.set(blinks, count);
    }
    return count;
}

let stonesPart1 = 0;
let stonesPart2 = 0;
for (let i = 0; i < stones.length; i++) {
    stonesPart1 += blink(stones[i], 25);
    stonesPart2 += blink(stones[i], 75);
}
console.log('Part 1:', stonesPart1); // 199986
console.log('Part 2:', stonesPart2); // 236804088748754
