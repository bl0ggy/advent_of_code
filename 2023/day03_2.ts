import { data } from './day03_data.ts';

type MatchPosition = RegExpExecArray & {
    row: number
}

let sum: number = 0;
const matchesNumbers: MatchPosition[] = [];
const matchesSymbols: MatchPosition[] = [];

// Find all numbers and symbols
data.split('\n')
.forEach((line, lineIndex) => {
    // symbols
    let match: RegExpExecArray | null;
    const numberRegex = /\d+/g;
    while((match = numberRegex.exec(line)) != null) {
        const matchPos: MatchPosition = match as MatchPosition;
        matchPos.row = lineIndex;
        matchesNumbers.push(matchPos);
    }
    // numbers
    const symbolRegex = /[^0-9.]/g;
    while((match = symbolRegex.exec(line)) != null) {
        const matchPos: MatchPosition = match as MatchPosition;
        matchPos.row = lineIndex;
        matchesSymbols.push(matchPos);
    }
});

for(const symbol of matchesSymbols) {
    const neighbourNumbers = matchesNumbers.filter((n) => n.row - 1 <= symbol.row && symbol.row <= n.row + 1 && n.index - 1 <= symbol.index && symbol.index <= n.index + n[0].length);
    if(symbol[0] === '*' && neighbourNumbers.length === 2) {
        sum += parseInt(neighbourNumbers[0][0], 10) * parseInt(neighbourNumbers[1][0], 10);
        for(const n of neighbourNumbers) {
            const index = matchesNumbers.indexOf(n);
            matchesNumbers.splice(index, 1);
        }
    }
}

console.log(sum); // 85010461
