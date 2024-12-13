import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

type Compounds<T> = {
    children: T;
    cats: T;
    samoyeds: T;
    pomeranians: T;
    akitas: T;
    vizslas: T;
    goldfish: T;
    trees: T;
    cars: T;
    perfumes: T;
};
const tickerTape: Compounds<number> = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
};

// Sue 1: goldfish: 9, cars: 0, samoyeds: 9
const aunts: Compounds<number | undefined>[] = [];
for (const line of lines) {
    const matchChildren = line.match(/children: (-?\d+)/);
    const matchCats = line.match(/cats: (-?\d+)/);
    const matchSamoyeds = line.match(/samoyeds: (-?\d+)/);
    const matchPomeranians = line.match(/pomeranians: (-?\d+)/);
    const matchAkitas = line.match(/akitas: (-?\d+)/);
    const matchVizslas = line.match(/vizslas: (-?\d+)/);
    const matchGoldfish = line.match(/goldfish: (-?\d+)/);
    const matchTrees = line.match(/trees: (-?\d+)/);
    const matchCars = line.match(/cars: (-?\d+)/);
    const matchPerfumes = line.match(/perfumes: (-?\d+)/);

    const compounds: Compounds<number | undefined> = {
        children: matchChildren !== null
            ? parseInt(matchChildren[1])
            : undefined,
        cats: matchCats !== null ? parseInt(matchCats[1]) : undefined,
        samoyeds: matchSamoyeds !== null
            ? parseInt(matchSamoyeds[1])
            : undefined,
        pomeranians: matchPomeranians !== null
            ? parseInt(matchPomeranians[1])
            : undefined,
        akitas: matchAkitas !== null ? parseInt(matchAkitas[1]) : undefined,
        vizslas: matchVizslas !== null ? parseInt(matchVizslas[1]) : undefined,
        goldfish: matchGoldfish !== null
            ? parseInt(matchGoldfish[1])
            : undefined,
        trees: matchTrees !== null ? parseInt(matchTrees[1]) : undefined,
        cars: matchCars !== null ? parseInt(matchCars[1]) : undefined,
        perfumes: matchPerfumes !== null
            ? parseInt(matchPerfumes[1])
            : undefined,
    };
    // console.log(line, compounds);
    aunts.push(compounds);
}

let auntNumberPart1 = -1;
let auntNumberPart2 = -1;
for (const [i, aunt] of aunts.entries()) {
    let possiblePart1 = true;
    let possiblePart2 = true;
    if (aunt.children !== undefined) {
        possiblePart1 &&= aunt.children === tickerTape.children;
        possiblePart2 &&= aunt.children === tickerTape.children;
    }
    if (aunt.cats !== undefined) {
        possiblePart1 &&= aunt.cats === tickerTape.cats;
        possiblePart2 &&= aunt.cats > tickerTape.cats;
    }
    if (aunt.samoyeds !== undefined) {
        possiblePart1 &&= aunt.samoyeds === tickerTape.samoyeds;
        possiblePart2 &&= aunt.samoyeds === tickerTape.samoyeds;
    }
    if (aunt.pomeranians !== undefined) {
        possiblePart1 &&= aunt.pomeranians === tickerTape.pomeranians;
        possiblePart2 &&= aunt.pomeranians < tickerTape.pomeranians;
    }
    if (aunt.akitas !== undefined) {
        possiblePart1 &&= aunt.akitas === tickerTape.akitas;
        possiblePart2 &&= aunt.akitas === tickerTape.akitas;
    }
    if (aunt.vizslas !== undefined) {
        possiblePart1 &&= aunt.vizslas === tickerTape.vizslas;
        possiblePart2 &&= aunt.vizslas === tickerTape.vizslas;
    }
    if (aunt.goldfish !== undefined) {
        possiblePart1 &&= aunt.goldfish === tickerTape.goldfish;
        possiblePart2 &&= aunt.goldfish < tickerTape.goldfish;
    }
    if (aunt.trees !== undefined) {
        possiblePart1 &&= aunt.trees === tickerTape.trees;
        possiblePart2 &&= aunt.trees > tickerTape.trees;
    }
    if (aunt.cars !== undefined) {
        possiblePart1 &&= aunt.cars === tickerTape.cars;
        possiblePart2 &&= aunt.cars === tickerTape.cars;
    }
    if (aunt.perfumes !== undefined) {
        possiblePart1 &&= aunt.perfumes === tickerTape.perfumes;
        possiblePart2 &&= aunt.perfumes === tickerTape.perfumes;
    }

    if (possiblePart1) {
        auntNumberPart1 = i + 1; // i starts from 0, aunt start from 1
    }
    if (possiblePart2) {
        auntNumberPart2 = i + 1;
    }
}

console.log('Part 1:', auntNumberPart1); // 40
console.log('Part 2:', auntNumberPart2); // 241
