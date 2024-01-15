import { data } from './day03_data.ts';

type NumberPosition = {
    row: number
    column: number
    size: number
}

function hasNeighbourSymbol(number: NumberPosition) : number {
    const lines = data.split('\n')
    .splice(Math.max(number.row - 1, 0), number.row === 0 ? 2 : 3)
    .map((line) => line.substring(Math.max(number.column - 1, 0), number.column + number.size + 1));
    const lines2 = lines.join('\n');
    const match = lines2.match(/[^\d.\n]/g);

    return match?.length || 0;
}

const numbers: number[] = [];
const numbersWrong: number[] = [];
let sum: number = 0;

// Find all numbers and symbols
data.split('\n')
.forEach((line, lineIndex) => {
    // numbers
    const matchesNumbers: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    const numberRegex = /\d+/g;
    while((match = numberRegex.exec(line)) != null) {
        matchesNumbers.push(match);
    }
    if(matchesNumbers) {
        for(let i = 0; i < matchesNumbers.length; i += 1) {
            const matchNumber = matchesNumbers[i];
            const has = hasNeighbourSymbol({
                row: lineIndex,
                column: matchNumber.index,
                size: matchNumber[0].length,
            });
            if(has) {
                numbers.push(parseInt(matchNumber[0], 10));
                sum += parseInt(matchNumber[0], 10);
            } else {
                numbersWrong.push(parseInt(matchNumber[0], 10));
            }
        }
    }
});
console.log(sum); // 550064
