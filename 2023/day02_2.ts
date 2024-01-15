import { data } from './day02_data';

class Game {
    red: number = 0;

    green: number = 0;

    blue: number = 0;
}

const result: number[] = data.split('\n')
.map((line) => {
    const [, gamesPlayedStr] = line.split(':');
    const gamesStr = gamesPlayedStr.split(';');
    const gameObject = new Game();
    for(const gameStr of gamesStr) {
        const cubes = gameStr.split(',')
        .map((cube) => cube.trim());
        for(const cube of cubes) {
            const [number, color] = cube.split(' ');
            switch(color) {
            case 'red':
                gameObject.red = Math.max(gameObject.red, parseInt(number, 10));
                break;
            case 'green':
                gameObject.green = Math.max(gameObject.green, parseInt(number, 10));
                break;
            case 'blue':
                gameObject.blue = Math.max(gameObject.blue, parseInt(number, 10));
                break;
            default:
                throw new Error('Invalid color');
            }
        }
    }
    const power = gameObject.red * gameObject.green * gameObject.blue;
    return power;
});

console.log(result.reduce((a, b) => a + b)); // 67953
