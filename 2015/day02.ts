import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

let totalPaperSquareFeet = 0;
let totalRibbonSquareFeet = 0;
for (const line of lines) {
    const [l, w, h] = line.split('x').map((s) => parseInt(s));
    const a1 = l * w;
    const a2 = w * h;
    const a3 = h * l;
    const minArea = Math.min(a1, a2, a3);
    totalPaperSquareFeet += (a1 + a2 + a3) * 2 + minArea;

    const mul = l * w * h;
    const minSum = Math.min(l + w, w + h, h + l);
    totalRibbonSquareFeet += mul + minSum * 2;
}
console.log('Part 1:', totalPaperSquareFeet); // 1606483
console.log('Part 2:', totalRibbonSquareFeet); // 3842356
