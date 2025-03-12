import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

let inMemoryChars = 0;
let encodedChars = 0;
for (const line of lines) {
    const text = line.substring(1, line.length - 1)
        .replaceAll('\\\\', '_')
        .replaceAll('\\"', '_')
        .replaceAll(/\\x[a-f0-9]{2}/g, '_');
    inMemoryChars += line.length - text.length;

    const encodedText = '"' + line
        .replaceAll('\\', '\\\\')
        .replaceAll('"', '\\"')
        .replaceAll('', '') +
        '"';
    console.log(line, encodedText);
    encodedChars += encodedText.length - line.length;
}

console.log('Part 1:', inMemoryChars); // 1371
console.log('Part 2:', encodedChars); // 2117
