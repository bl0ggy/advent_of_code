import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

const leftList: number[] = [];
const rightList: number[] = [];
for (let i = 0; i < lines.length; i += 1) {
    const [left, right] = lines[i].split('   ');
    leftList.push(parseInt(left, 10));
    rightList.push(parseInt(right, 10));
}
leftList.sort();
rightList.sort();

let sum: number = 0;
for (let i = 0; i < leftList.length; i += 1) {
    sum += Math.abs(leftList[i] - rightList[i]);
}
console.log('Part 1', sum); // 1970720

sum = 0;
const map: Map<number, number> = new Map();
for (let i = 0; i < rightList.length; i += 1) {
    const val = rightList[i];
    if (!map.has(val)) {
        map.set(val, 1);
        continue;
    } else {
        map.set(val, (map.get(val) as number) + 1);
    }
}
for (let i = 0; i < leftList.length; i += 1) {
    const val = leftList[i];
    const count = map.get(val);
    if (count === undefined) {
        continue;
    } else {
        sum += val * count;
    }
}
console.log('Part 2', sum); // 17191599
