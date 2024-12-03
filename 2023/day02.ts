import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

let result: number[] = lines
    .map((line: string) => {
        const [gameNumberStr, gamesPlayedStr] = line.split(':');
        const gameNumber = parseInt(gameNumberStr.substring(5), 10);
        let valid = true;
        const gamesStr = gamesPlayedStr.split(';');
        for (const gameStr of gamesStr) {
            const cubes = gameStr.split(',')
                .map((cube) => cube.trim());
            for (const cube of cubes) {
                const [number, color] = cube.split(' ');
                switch (color) {
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
    .filter((g: number) => g >= 1);
console.log('Part 1:', result.reduce((a, b) => a + b)); // 2278

class Game {
    red: number = 0;
    green: number = 0;
    blue: number = 0;
}

result = lines
    .map((line: string) => {
        const [, gamesPlayedStr] = line.split(':');
        const gamesStr = gamesPlayedStr.split(';');
        const gameObject = new Game();
        for (const gameStr of gamesStr) {
            const cubes = gameStr.split(',')
                .map((cube) => cube.trim());
            for (const cube of cubes) {
                const [number, color] = cube.split(' ');
                switch (color) {
                    case 'red':
                        gameObject.red = Math.max(
                            gameObject.red,
                            parseInt(number, 10),
                        );
                        break;
                    case 'green':
                        gameObject.green = Math.max(
                            gameObject.green,
                            parseInt(number, 10),
                        );
                        break;
                    case 'blue':
                        gameObject.blue = Math.max(
                            gameObject.blue,
                            parseInt(number, 10),
                        );
                        break;
                    default:
                        throw new Error('Invalid color');
                }
            }
        }
        const power = gameObject.red * gameObject.green * gameObject.blue;
        return power;
    });
console.log('Part 2:', result.reduce((a, b) => a + b)); // 67953
