import { data } from './day06_data';

const [lineTime, lineDistance] = data.split('\n');

const times = (lineTime.split(':')[1].match(/\d+/g) as RegExpMatchArray).map((t) => parseInt(t, 10));
const distances = (lineDistance.split(':')[1].match(/\d+/g) as RegExpMatchArray).map((d) => parseInt(d, 10));

const games: { time: number, distance: number, even: boolean, further: number }[] = [];
for(let i = 0; i < times.length; i += 1) {
    games.push({
        time: times[i], distance: distances[i], even: times[i] % 2 === 0, further: 0,
    });
}

for(const game of games) {
    for(let i = 0; i <= game.time; i += 1) {
        // console.log(i * (game.time - (i - 1)));
        const mul = i * (game.time - i);
        if(mul > game.distance) {
            game.further += 1;
        } else if(game.further > 0) {
            break;
        }
    }
}
console.log(games.map((g) => g.further)
.reduce((a, b) => a * b)); // 219849
