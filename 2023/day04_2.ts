import { data } from './day04_data';

let totalSum = 0;
type Game = {
    id: number;
    amount: number;
    winningNumbers: number[];
    myNumbers: number[];
}
const games: Game[] = [];

data.split('\n')
.forEach((line) => {
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
for(const [index, game] of games.entries()) {
    const correctNumbers = game.winningNumbers.filter((n) => game.myNumbers.includes(n)).length;
    if(correctNumbers > 0) {
        for(let i = index + 1; i < index + 1 + correctNumbers; i += 1) {
            if(games.length <= i) {
                break;
            }
            games[i].amount += game.amount;
        }
    }
    totalSum += game.amount;
}
console.log(totalSum); // 19499881
