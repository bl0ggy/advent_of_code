import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

enum Happiness {
    Gain,
    Loss,
}

const relationMap: Map<string, { kind: Happiness; amount: number }> = new Map();
const people: string[] = [];
for (const line of lines) {
    const [person1, kind, amount, person2] = line.replace('would ', '').replace(
        'happiness units by sitting next to ',
        '',
    ).replace('.', '').split(' ');
    relationMap.set(`${person1},${person2}`, {
        kind: kind === 'gain' ? Happiness.Gain : Happiness.Loss,
        amount: parseInt(amount),
    });
    if (!people.includes(person1)) {
        people.push(person1);
    }
    if (!people.includes(person2)) {
        people.push(person2);
    }
}

function getHappiness(person1: string, person2: string) {
    if (person1 === '' || person2 === '') {
        return 0;
    }
    let sum = 0;
    const relation1 = relationMap.get(`${person1},${person2}`);
    const relation2 = relationMap.get(`${person2},${person1}`);
    if (relation1?.kind === Happiness.Gain) {
        sum += relation1.amount;
    }
    if (relation2?.kind === Happiness.Loss) {
        sum -= relation2.amount;
    }
    return sum;
}

function findNext(
    previous: string[],
    current: string,
    remaining: string[],
    happiness: number,
): number {
    if (remaining.length === 0) {
        return happiness + getHappiness(previous[0], current) +
            getHappiness(current, previous[0]);
    }
    let max = 0;
    for (const p of remaining) {
        max = Math.max(
            max,
            findNext(
                [...previous, current],
                p,
                remaining.filter((e) => e != p),
                happiness + getHappiness(p, current) + getHappiness(current, p),
            ),
        );
    }
    return max;
}

let maxHappinessPart1 = 0;
for (const p of people) {
    maxHappinessPart1 = Math.max(
        maxHappinessPart1,
        findNext([], p, people.filter((e) => e != p), 0),
    );
}
console.log('Part 1:', maxHappinessPart1); // 709

people.push(''); // Ourself
let maxHappinessPart2 = 0;
for (const p of people) {
    maxHappinessPart2 = Math.max(
        maxHappinessPart2,
        findNext([], p, people.filter((e) => e != p), 0),
    );
}
console.log('Part 2:', maxHappinessPart2); // 668
