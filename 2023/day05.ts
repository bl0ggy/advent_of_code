import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const allLines: string[] = data.split('\n');
allLines.pop(); // Remove empty last line
const seedsLine: string = allLines[0];
const lines = allLines.slice(2).join('\n');
const blocks = lines.split('\n\n');

const seedsToPlant: number[] = seedsLine.substring(7)
    .split(' ')
    .map((n: string) => parseInt(n, 10));
let maps = blocks.map((m: string) => {
    const lines = m.split('\n');
    const converter = lines[0].split(' ')[0].split('-to-');
    lines.splice(0, 1);
    const mappings = lines.map((l) => {
        const numbers = l.split(' ');
        return {
            dst: parseInt(numbers[0], 10),
            src: parseInt(numbers[1], 10),
            range: parseInt(numbers[2], 10),
        };
    });
    mappings.sort((a, b) => a.src - b.src);
    return {
        from: converter[0],
        to: converter[1],
        mappings,
    };
});

const locations: number[] = [];
for (const seed of seedsToPlant) {
    let currentLocation = seed;
    for (const map of maps) {
        for (const mapping of map.mappings) {
            if (
                currentLocation >= mapping.src &&
                currentLocation <= mapping.src + mapping.range
            ) {
                currentLocation = mapping.dst + (currentLocation - mapping.src);
                break;
            }
        }
    }
    locations.push(currentLocation);
}

locations.sort((a, b) => a - b);
console.log('Part 1:', locations[0]); // 993500720

const seedsToPlant2 = seedsLine.substring(7)
    .match(/\d+ \d+/g)
    ?.map((s: string) => ({
        state: 'seed',
        start: parseInt(s.split(' ')[0], 10),
        range: parseInt(s.split(' ')[1], 10),
    }));

if (!seedsToPlant2) {
    throw new Error('No seed to plant');
}

maps = blocks.map((m: string) => {
    const lines = m.split('\n');
    const converter = lines[0].split(' ')[0].split('-to-');
    lines.splice(0, 1);
    const mappings = lines.map((l) => {
        const numbers = l.split(' ');
        return {
            dst: parseInt(numbers[0], 10),
            src: parseInt(numbers[1], 10),
            range: parseInt(numbers[2], 10),
        };
    });
    mappings.sort((a, b) => a.src - b.src);
    return {
        from: converter[0],
        to: converter[1],
        mappings,
    };
});

let seedUndefined: typeof seedsToPlant2[0] | undefined;
let seed: typeof seedsToPlant2[0];
while (
    (seedUndefined = seedsToPlant2.find((s) => s.state !== 'location')) !==
        undefined
) {
    seed = seedUndefined;
    const iLocation = seedsToPlant2.indexOf(seed);
    let mapUndefined: typeof maps[0] | undefined;
    let map: typeof maps[0];
    while (
        (mapUndefined = maps.find((m) => m.from === seed.state)) !== undefined
    ) {
        map = mapUndefined;
        if (!map) throw new Error('Seed has wrong state');
        let foundMapping = map.mappings.find((m) =>
            m.src <= seed.start && seed.start < m.src + m.range
        );
        if (foundMapping) {
            if (
                seed.start + seed.range > foundMapping.src + foundMapping.range
            ) {
                // Range overflow, create a new range
                // const overflowedDiff = currentLocation.start + currentLocation.range - foundMapping.src + foundMapping.range;
                const inRangeDiff = foundMapping.src + foundMapping.range -
                    seed.start;
                seedsToPlant2.splice(iLocation, 0, {
                    start: seed.start + inRangeDiff,
                    range: seed.range - inRangeDiff,
                    state: seed.state,
                });
                seed.range = inRangeDiff;
            }
            seed.start += foundMapping.dst - foundMapping.src;
            seed.state = map.to;
        } else {
            // No mapping, find the closest upper one
            // Mappings are sorted by src increasing
            foundMapping = map.mappings.find((m) => seed.start < m.src);
            if (!foundMapping) {
                // The range is above all mapping
                seed.state = map.to;
                break;
            }

            // We found a mapping higher
            const outOfRangeDiff = foundMapping.src - seed.start;
            seedsToPlant2.splice(iLocation, 0, {
                start: seed.start + outOfRangeDiff,
                range: seed.range - outOfRangeDiff,
                state: seed.state,
            });
            seed.range = outOfRangeDiff;
            seed.state = map.to;
        }
    }
}
seedsToPlant2.sort((a, b) => a.start - b.start);
console.log('Part 2:', seedsToPlant2[0].start); // 4917124
