import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

enum Operation {
    Add,
    Multiply,
    Concat,
}
type Set = {
    expectedValue: number;
    values: number[];
};

const sets: Set[] = lines.map((l) => {
    const [expectedStr, valuesStr] = l.split(': ');
    const values: number[] = valuesStr.split(' ').map((v) => parseInt(v));
    return {
        expectedValue: parseInt(expectedStr),
        values,
    };
});

function doNext(
    expectedValue: number,
    currentValue: number,
    operation: Operation,
    remaining: number[],
    allowConcat: boolean,
): boolean {
    if (remaining.length === 0) {
        return currentValue === expectedValue;
    }
    let newCurrentValue: number;
    switch (operation) {
        case Operation.Add:
            newCurrentValue = currentValue + remaining[0];
            break;
        case Operation.Multiply:
            newCurrentValue = currentValue * remaining[0];
            break;
        case Operation.Concat:
            newCurrentValue = parseInt('' + currentValue + remaining[0]);
            break;
    }
    const newRemaining = remaining.slice(1);
    let result = false;
    result = result || doNext(
        expectedValue,
        newCurrentValue,
        Operation.Add,
        newRemaining,
        allowConcat,
    );
    result = result || doNext(
        expectedValue,
        newCurrentValue,
        Operation.Multiply,
        newRemaining,
        allowConcat,
    );
    if (allowConcat) {
        result = result || doNext(
            expectedValue,
            newCurrentValue,
            Operation.Concat,
            newRemaining,
            allowConcat,
        );
    }

    return result;
}

let sumPart1 = 0;
let sumPart2 = 0;
for (const set of sets) {
    const addWithoutConcat = doNext(
        set.expectedValue,
        set.values[0],
        Operation.Add,
        set.values.slice(1),
        false,
    );
    const multiplyWithoutConcat = doNext(
        set.expectedValue,
        set.values[0],
        Operation.Multiply,
        set.values.slice(1),
        false,
    );
    const addWithConcat = doNext(
        set.expectedValue,
        set.values[0],
        Operation.Add,
        set.values.slice(1),
        true,
    );
    const multiplyWithConcat = doNext(
        set.expectedValue,
        set.values[0],
        Operation.Multiply,
        set.values.slice(1),
        true,
    );
    const concatWithConcat = doNext(
        set.expectedValue,
        set.values[0],
        Operation.Concat,
        set.values.slice(1),
        true,
    );
    if (addWithoutConcat || multiplyWithoutConcat) {
        sumPart1 += set.expectedValue;
    }
    if (addWithConcat || multiplyWithConcat || concatWithConcat) {
        sumPart2 += set.expectedValue;
    }
}

console.log('Part 1', sumPart1); // 2501605301465
console.log('Part 2', sumPart2); // 44841372855953
