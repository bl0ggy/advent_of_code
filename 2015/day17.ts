import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

const numbers = lines.map((l) => parseInt(l));

function addNumber(
    number: number,
    currentSum: number,
    amountOfNumbersUsed: number,
    remainingNumbers: number[],
    sumGoal: number,
    sumList: number[],
) {
    if (remainingNumbers.length === 0) {
        if (currentSum === sumGoal) {
            sumList.push(amountOfNumbersUsed);
        }
        return;
    }
    addNumber(
        0,
        currentSum,
        amountOfNumbersUsed,
        remainingNumbers.slice(1),
        sumGoal,
        sumList,
    );
    addNumber(
        remainingNumbers[0],
        currentSum + remainingNumbers[0],
        amountOfNumbersUsed + 1,
        remainingNumbers.slice(1),
        sumGoal,
        sumList,
    );
}

const sumList: number[] = [];
addNumber(0, 0, 0, numbers, 150, sumList);

console.log('Part 1:', sumList.length); // 4372
console.log('Part 2:', sumList.reduce((a, v) => Math.min(a, v))); // 4
