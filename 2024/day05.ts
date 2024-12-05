import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

const rules: Map<number, number[]> = new Map();
const pageSets: number[][] = [];
for (let i = 0; i < lines.length; i++) {
    const rule = lines[i].match(/(\d+)\|(\d+)/);
    if (rule) {
        const ruleFirst = parseInt(rule[1]);
        const ruleSecond = parseInt(rule[2]);
        if (!rules.has(ruleFirst)) {
            rules.set(ruleFirst, []);
        }
        rules.get(ruleFirst)!.push(ruleSecond);
        rules.get(ruleFirst)!.sort();
    } else if (lines[i] === '') {
        continue;
    } else { // Pages lines
        const pageSet = lines[i].split(',').map((s) => parseInt(s));
        pageSets.push(pageSet);
    }
}
let middlePagesSumPart1 = 0;
let middlePagesSumPart2 = 0;
for (const pageSet of pageSets) {
    let correct = true;
    for (let i = 0; correct && i < pageSet.length; i++) {
        if (!rules.has(pageSet[i])) {
            continue;
        }
        const rule = rules.get(pageSet[i])!;
        for (let j = 0; correct && j < i; j++) {
            if (rule.includes(pageSet[j])) {
                correct = false;
            }
        }
    }

    if (correct) {
        const middlePage = pageSet[(pageSet.length - 1) / 2]; // Considere length is always odd
        middlePagesSumPart1 += middlePage;
        continue;
    }

    pageSet.sort((a, b) => {
        if (rules.has(a)) {
            const rulesA = rules.get(a)!;
            if (rulesA.includes(b)) {
                return -1;
            }
        }
        if (rules.has(b)) {
            const rulesB = rules.get(b)!;
            if (rulesB.includes(a)) {
                return 1;
            }
        }
        return 0;
    });
    const middlePage = pageSet[(pageSet.length - 1) / 2]; // Considere length is always odd
    middlePagesSumPart2 += middlePage;
}

console.log('Part 1', middlePagesSumPart1); // 6242
console.log('Part 2', middlePagesSumPart2); // 5169
