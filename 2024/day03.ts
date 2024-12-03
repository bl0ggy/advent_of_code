import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

enum Type {
    mul,
    do,
    dont,
}

let sumPart1: number = 0;
let sumPart2: number = 0;
let do_ = true;
for (let i = 0; i < lines.length; i += 1) {
    const mulMatches = lines[i]
        .matchAll(/mul\(\d{1,3},\d{1,3}\)/g)
        .toArray()
        .map(
            (e) => {
                return { v: e[0], i: e.index, type: Type.mul };
            },
        );
    const doMatches = lines[i]
        .matchAll(/do\(\)/g)
        .toArray()
        .map(
            (e) => {
                return { v: e[0], i: e.index, type: Type.do };
            },
        );
    const dontMatches = lines[i]
        .matchAll(/don't\(\)/g)
        .toArray()
        .map(
            (e) => {
                return { v: e[0], i: e.index, type: Type.dont };
            },
        );
    const allMatches = [...mulMatches, ...doMatches, ...dontMatches];
    allMatches.sort((a, b) => a.i - b.i);
    for (const match of allMatches) {
        switch (match.type) {
            case Type.mul:
                {
                    const num1 = parseInt(match.v.slice(4));
                    const num2 = parseInt(
                        match.v.slice(match.v.indexOf(',') + 1),
                    );
                    sumPart1 += num1 * num2;
                    if (do_) {
                        sumPart2 += num1 * num2;
                    }
                }
                break;
            case Type.do:
                do_ = true;
                break;
            case Type.dont:
                do_ = false;
                break;
        }
    }
}
console.log('Part 1', sumPart1); // 184576302
console.log('Part 2', sumPart2); // 118173507
