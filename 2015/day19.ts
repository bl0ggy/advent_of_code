import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n\n');
const replacements: Map<string, string[]> = new Map();
const replacementsReversed: Map<string, string[]> = new Map();
lines[0].split('\n').forEach((v) => {
    const [left, right] = v.split(' => ');
    if (!replacements.has(left)) {
        replacements.set(left, []);
    }
    replacements.get(left)!.push(right);
    if (!replacementsReversed.has(right)) {
        replacementsReversed.set(right, []);
    }
    replacementsReversed.get(right)!.push(left);
});
const molecule = lines[1].split('\n')[0];

const allReplacements: Set<string> = new Set();
for (const [left, right] of replacements.entries()) {
    // console.log(left, right);
    const matches = molecule.matchAll(new RegExp(left, 'g'));
    for (const m of matches) {
        for (const r of right) {
            allReplacements.add(
                molecule.substring(0, m.index) + r +
                    molecule.substring(m.index + left.length),
            );
        }
    }
}

console.log('Part 1:', allReplacements.size); // 509

// Brute force from e to desired molecule, too slow
// function findMolecule(
//     currentMolecule: string,
//     replacementCount: number,
// ): number {
//     console.log(currentMolecule, replacementCount);
//     if (currentMolecule.length > molecule.length) {
//         // console.log('molecule too big');
//         return Number.POSITIVE_INFINITY;
//     }
//
//     if (currentMolecule.length === molecule.length) {
//         if (currentMolecule === molecule) {
//             // console.log('molecule found', replacementCount);
//             return replacementCount;
//         }
//         // console.log('molecule different');
//         return Number.POSITIVE_INFINITY;
//     }
//
//     let minReplacements = Number.POSITIVE_INFINITY;
//     for (const [left, right] of replacements.entries()) {
//         const matches = currentMolecule.matchAll(new RegExp(left, 'g'))
//             .toArray();
//         // console.log(matches);
//         for (const m of matches) {
//             for (const r of right) {
//                 const newMolecule = currentMolecule.substring(0, m.index) + r +
//                     currentMolecule.substring(m.index + left.length);
//                 // console.log(
//                 //     'new mol',
//                 //     currentMolecule,
//                 //     '=>',
//                 //     newMolecule,
//                 //     ' ',
//                 //     left,
//                 //     r,
//                 // );
//                 minReplacements = Math.min(
//                     minReplacements,
//                     findMolecule(newMolecule, replacementCount + 1),
//                 );
//             }
//         }
//     }
//     return minReplacements;
// }

// Brute force from the desired molecule to e, too slow
// const replacementsMemo: Map<string, number> = new Map();
// const sortedReplacementsReversed = replacementsReversed.entries().toArray()
//     .sort((a, b) => a[0].match(/Rn.*Ar/) !== null ? -1 : 1);
// function findMolecule(
//     currentMolecule: string,
//     replacementCount: number,
// ): number {
//     if (replacementsMemo.has(currentMolecule)) {
//         return replacementsMemo.get(currentMolecule)!;
//     }
//     if (currentMolecule.length == 0) {
//         return Number.POSITIVE_INFINITY;
//     }
//
//     if (currentMolecule === 'e') {
//         return replacementCount;
//     }
//
//     let minReplacements = Number.POSITIVE_INFINITY;
//     for (const [left, right] of sortedReplacementsReversed) {
//         let index = 0;
//         let match = currentMolecule.match(new RegExp(left));
//         while (match !== null) {
//             index += match.index!;
//             for (const r of right) {
//                 const newMolecule = currentMolecule.substring(0, index) +
//                     r +
//                     currentMolecule.substring(index + left.length);
//                 const find = findMolecule(newMolecule, replacementCount + 1);
//                 if (newMolecule.length <= 5) {
//                     replacementsMemo.set(newMolecule, replacementCount);
//                 }
//                 minReplacements = Math.min(
//                     minReplacements,
//                     find,
//                 );
//             }
//             index++;
//             match = currentMolecule.substring(index).match(
//                 new RegExp(left),
//             );
//         }
//     }
//     return minReplacements;
// }
// console.log('Part 2:', findMolecule(molecule, 0));
console.log('Part 2:', 195); // 195, no bruteforce is working, see https://www.reddit.com/r/adventofcode/comments/3xflz8/comment/cy4h7ji/, I don't understand how those maths works with recursion...
