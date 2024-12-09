import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n')
    .map((l) => l.split(''));
lines.pop();

const memoryPart1: (number | null)[] = [];
let isFile = true;
let fileId: number | null = 0;
for (const char of lines[0]) {
    const space = parseInt(char);
    for (let i = 0; i < space; i++) {
        memoryPart1.push(isFile ? fileId : null);
    }
    isFile && (fileId++);
    isFile = !isFile;
}
const memoryPart2 = [...memoryPart1];
let right = memoryPart1.length;
let left = 0;
for (; left < right; left++) {
    if (Number.isInteger(memoryPart1[left])) {
        continue;
    }

    for (; right >= left; right--) {
        if (Number.isInteger(memoryPart1[right])) {
            const tmp = memoryPart1[left];
            memoryPart1[left] = memoryPart1[right];
            memoryPart1[right] = tmp;
            break;
        }
    }
}
function getChecksum(memory: NN[]) {
    let checksum = 0;
    for (const [i, c] of memory.entries()) {
        if (c === null) {
            continue;
        }
        checksum += i * c;
    }
    return checksum;
}
console.log('Part 1:', getChecksum(memoryPart1)); // 6448989155953

type NN = number | null;
type File = { start: NN; size: NN; id: NN };
type Space = { start: NN; size: NN };
function findNextFile(right: number): File {
    let start: number | null = null;
    let id: number | null = null;
    let size: number | null = null;
    for (; right >= 0; right--) {
        if (id === null || start === null) {
            if (memoryPart2[right] === null) {
                continue;
            }
            id = memoryPart2[right];
            start = right;
        } else {
            if (memoryPart2[right] === id) {
                continue;
            }
            size = start - right;
            break;
        }
    }
    return { start, id, size };
}
function findNextEmptySpace(left: number, minSize: number): Space {
    let start: number | null = null;
    let size: number | null = null;
    for (; left < memoryPart2.length; left++) {
        if (start === null) {
            if (memoryPart2[left] !== null) {
                continue;
            }
            start = left;
        } else {
            if (memoryPart2[left] === null) {
                continue;
            }
            size = left - start;
            if (size >= minSize) {
                break;
            } else {
                start = null;
                size = null;
            }
        }
    }
    return { start, size };
}
function exchange(file: File, space: Space) {
    if (space.start === null || file.start === null || file.size == null) {
        return;
    }
    if (file.start - file.size < space.start) {
        return;
    }
    for (let i = 0; i < file.size; i++) {
        memoryPart2[space.start + i] =
            memoryPart2[file.start - file.size + 1 + i];
        memoryPart2[file.start - file.size + 1 + i] = null;
    }
}
left = 0;
right = memoryPart2.length - 1;
while (right > 0) {
    const file = findNextFile(right);
    if (file.start === null || file.size === null) {
        break;
    }
    right = file.start - file.size;
    const space = findNextEmptySpace(left, file.size);
    exchange(file, space);
}
console.log('Part 2:', getChecksum(memoryPart2)); // 6476642796832
