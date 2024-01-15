import {
    data, maxRed, maxGreen, maxBlue,
} from './day02_data';

const result: number[] = data.split('\n')
.map((line) => {
    const [gameNumberStr, gamesPlayedStr] = line.split(':');
    const gameNumber = parseInt(gameNumberStr.substring(5), 10);
    let valid = true;
    const gamesStr = gamesPlayedStr.split(';');
    for(const gameStr of gamesStr) {
        const cubes = gameStr.split(',')
        .map((cube) => cube.trim());
        for(const cube of cubes) {
            const [number, color] = cube.split(' ');
            switch(color) {
            case 'red':
                valid = valid && parseInt(number, 10) <= maxRed;
                break;
            case 'green':
                valid = valid && parseInt(number, 10) <= maxGreen;
                break;
            case 'blue':
                valid = valid && parseInt(number, 10) <= maxBlue;
                break;
            default:
                throw new Error('Invalid color');
            }
        }
    }
    return valid ? gameNumber : -1;
})
.filter((g) => g >= 1);

console.log(result.reduce((a, b) => a + b)); // 2278
