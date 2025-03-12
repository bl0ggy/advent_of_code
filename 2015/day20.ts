import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();
const minPresents = parseInt(lines[0]);
// console.log({ minPresents });

// Brute force, ~30min
// let housePart1 = 0, housePart2 = 0;
// const elves: Map<number, number> = new Map();
// for (
//     let houseNum = 1;
//     housePart1 < minPresents || housePart2 < minPresents;
//     houseNum++
// ) {
//     if (housePart1 < minPresents) {
//         housePart1 = 0;
//         for (let elf = 1; elf <= houseNum; elf++) {
//             if (houseNum % elf == 0) {
//                 housePart1 += elf * 10;
//             }
//         }
//     }
//
//     if (housePart2 < minPresents) {
//         elves.set(houseNum, 50);
//         housePart2 = 0;
//         for (const [elf, houses] of elves) {
//             if (houses > 0 && houseNum % elf == 0) {
//                 housePart2 += elf * 11;
//                 if (houses > 1) {
//                     elves.set(elf, houses - 1);
//                 } else {
//                     elves.delete(elf);
//                 }
//             }
//         }
//     }
//     // console.log(houseNum, housePart1);
//     // console.log(houseNum, housePart2);
// }

// const n = 1000000;
// const numbers: boolean[] = Array(n).fill(true);
// numbers[0] = false;
// numbers[1] = false;
// let primes: number[] = [];
// for (let i = 2; i < 1000; i++) {
//     if (numbers[i] === true) {
//         // primes.push(i);
//         for (let j = i * i; j < n; j += i) {
//             numbers[j] = false;
//         }
//     }
// }
// for (const [n, i] of numbers.entries()) {
//     if (i) primes.push(n);
// }
// primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
// async function solve(input: number, primeIndex: number): Promise<number> {
//     if (primeIndex < 0) {
//         return input;
//     }
//
//     let best = await solve(input, primeIndex - 1);
//
//     const prime = primes[primeIndex];
//     let power = 1;
//     let sum = 1;
//     while (sum < input) {
//         power = power * prime;
//         sum = sum + power;
//         const subgoal = Math.floor((input + sum - 1) / sum);
//         const subBest = await solve(subgoal, primeIndex - 1);
//         best = Math.min(best, power * subBest);
//     }
//
//     return best;
// }
// console.log(await solve(minPresents, primes.length - 1));
//
// console.log('Part 1:', housePart1); // 831600 (reaches 36902400 presents)
// console.log('Part 2:', housePart2); // 884520 (reaches 36191925 presents)

const housesPart1: number[] = Array(minPresents / 10).fill(0);
const housesPart2: number[] = Array(minPresents / 10).fill(0);
for (let i = 1; i < minPresents / 10; i++) {
    for (let j = i, visits = 0; j < minPresents / 10; j += i, visits++) {
        housesPart1[j] += i * 10;
        if (visits < 50) {
            housesPart2[j] += i * 11;
        }
    }
}
console.log(
    'Part 1:',
    housesPart1.entries().filter((h) => h[1] >= minPresents).toArray()[0][0],
); // 831600 (reaches 36902400 presents)
console.log(
    'Part 2:',
    housesPart2.entries().filter((h) => h[1] >= minPresents).toArray()[0][0],
); // 884520 (reaches 36191925 presents)
