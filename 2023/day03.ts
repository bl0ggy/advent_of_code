import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

type NumberPosition = {
    row: number;
    column: number;
    size: number;
};

function hasNeighbourSymbol(number: NumberPosition): number {
    const lines = data.split('\n')
        .splice(Math.max(number.row - 1, 0), number.row === 0 ? 2 : 3)
        .map((line: string) =>
            line.substring(
                Math.max(number.column - 1, 0),
                number.column + number.size + 1,
            )
        );
    const lines2 = lines.join('\n');
    const match = lines2.match(/[^\d.\n]/g);

    return match?.length || 0;
}

const numbers: number[] = [];
const numbersWrong: number[] = [];
let sum: number = 0;

// Find all numbers and symbols
data.split('\n')
    .forEach((line: string, lineIndex: number) => {
        // numbers
        const matchesNumbers: RegExpExecArray[] = [];
        let match: RegExpExecArray | null;
        const numberRegex = /\d+/g;
        while ((match = numberRegex.exec(line)) != null) {
            matchesNumbers.push(match);
        }
        if (matchesNumbers) {
            for (let i = 0; i < matchesNumbers.length; i += 1) {
                const matchNumber = matchesNumbers[i];
                const has = hasNeighbourSymbol({
                    row: lineIndex,
                    column: matchNumber.index,
                    size: matchNumber[0].length,
                });
                if (has) {
                    numbers.push(parseInt(matchNumber[0], 10));
                    sum += parseInt(matchNumber[0], 10);
                } else {
                    numbersWrong.push(parseInt(matchNumber[0], 10));
                }
            }
        }
    });
console.log('Part 1:', sum); // 550064

type MatchPosition = RegExpExecArray & {
    row: number;
};

sum = 0;
const matchesNumbers: MatchPosition[] = [];
const matchesSymbols: MatchPosition[] = [];

// Find all numbers and symbols
data.split('\n')
    .forEach((line: string, lineIndex: number) => {
        // symbols
        let match: RegExpExecArray | null;
        const numberRegex = /\d+/g;
        while ((match = numberRegex.exec(line)) != null) {
            const matchPos: MatchPosition = match as MatchPosition;
            matchPos.row = lineIndex;
            matchesNumbers.push(matchPos);
        }
        // numbers
        const symbolRegex = /[^0-9.]/g;
        while ((match = symbolRegex.exec(line)) != null) {
            const matchPos: MatchPosition = match as MatchPosition;
            matchPos.row = lineIndex;
            matchesSymbols.push(matchPos);
        }
    });

for (const symbol of matchesSymbols) {
    const neighbourNumbers = matchesNumbers.filter((n) =>
        n.row - 1 <= symbol.row && symbol.row <= n.row + 1 &&
        n.index - 1 <= symbol.index && symbol.index <= n.index + n[0].length
    );
    if (symbol[0] === '*' && neighbourNumbers.length === 2) {
        sum += parseInt(neighbourNumbers[0][0], 10) *
            parseInt(neighbourNumbers[1][0], 10);
        for (const n of neighbourNumbers) {
            const index = matchesNumbers.indexOf(n);
            matchesNumbers.splice(index, 1);
        }
    }
}
console.log('Part 2:', sum); // 85010461
