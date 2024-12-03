import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();

let [lineTime, lineDistance] = data.split('\n');
const times = (lineTime.split(':')[1].match(/\d+/g) as RegExpMatchArray).map((
    t,
) => parseInt(t, 10));
const distances = (lineDistance.split(':')[1].match(/\d+/g) as RegExpMatchArray)
    .map((d) => parseInt(d, 10));

const games: {
    time: number;
    distance: number;
    even: boolean;
    further: number;
}[] = [];
for (let i = 0; i < times.length; i += 1) {
    games.push({
        time: times[i],
        distance: distances[i],
        even: times[i] % 2 === 0,
        further: 0,
    });
}

for (const game of games) {
    for (let i = 0; i <= game.time; i += 1) {
        // console.log(i * (game.time - (i - 1)));
        const mul = i * (game.time - i);
        if (mul > game.distance) {
            game.further += 1;
        } else if (game.further > 0) {
            break;
        }
    }
}
console.log(
    'Part 1:',
    games.map((g) => g.further)
        .reduce((a, b) => a * b),
); // 219849

[lineTime, lineDistance] = data.split('\n');

const time = parseInt(lineTime.split(':')[1].replace(/\s/g, ''), 10);
const distance = parseInt(lineDistance.split(':')[1].replace(/\s/g, ''), 10);

let maxBelow = 0;
let minAbove = Math.round(time / 2);
while (minAbove - maxBelow > 1) {
    const middle = Math.round((minAbove + maxBelow) / 2);
    const dist = middle * (time - middle + 1);
    if (dist > distance) {
        minAbove = middle;
    } else {
        maxBelow = middle;
    }
}
console.log('Part 2:', time - 2 * minAbove + 1); // 29432455
