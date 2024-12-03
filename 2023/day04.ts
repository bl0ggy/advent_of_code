import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

let sum = 0;

lines.forEach((line: string) => {
    const [, numbersLine] = line.split(':');
    const [winningNumbersLine, myNumbersLine] = numbersLine.split('|');
    const winningNumbers = winningNumbersLine.replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10));
    const myNumbers = myNumbersLine.replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10));

    const correctNumbers = winningNumbers.filter((n) =>
        myNumbers.includes(n)
    ).length;
    if (correctNumbers > 0) {
        sum += 2 ** (correctNumbers - 1);
    }
});
console.log('Part 1:', sum); // 25651

let totalSum = 0;
type Game = {
    id: number;
    amount: number;
    winningNumbers: number[];
    myNumbers: number[];
};
const games: Game[] = [];

lines.forEach((line: string) => {
    const [gameIdLine, numbersLine] = line.split(':');
    const [winningNumbersLine, myNumbersLine] = numbersLine.split('|');
    const winningNumbers = winningNumbersLine.replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10));
    const myNumbers = myNumbersLine.replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10));

    const game: Game = {
        id: parseInt(gameIdLine.substring(5), 10),
        amount: 1,
        winningNumbers,
        myNumbers,
    };

    games.push(game);
});
for (const [index, game] of games.entries()) {
    const correctNumbers = game.winningNumbers.filter((n) =>
        game.myNumbers.includes(n)
    ).length;
    if (correctNumbers > 0) {
        for (let i = index + 1; i < index + 1 + correctNumbers; i += 1) {
            if (games.length <= i) {
                break;
            }
            games[i].amount += game.amount;
        }
    }
    totalSum += game.amount;
}
console.log('Part 2:', totalSum); // 19499881
