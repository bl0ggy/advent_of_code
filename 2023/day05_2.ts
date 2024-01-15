import util from 'util';
import { data } from './day05_data';

const blocks = data.split('\n\n');
const seedsToPlant = blocks[0].substring(7)
.match(/\d+ \d+/g)
?.map((s) => ({ state: 'seed', start: parseInt(s.split(' ')[0], 10), range: parseInt(s.split(' ')[1], 10) }));

if(!seedsToPlant) {
    throw new Error('No seed to plant');
}

blocks.splice(0, 1);
const maps = blocks.map((m) => {
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

let seed: typeof seedsToPlant[0];
while((seed = seedsToPlant.find((s) => s.state !== 'location')) !== undefined) {
    const iLocation = seedsToPlant.indexOf(seed);
    let map: typeof maps[0];
    while((map = maps.find((m) => m.from === seed.state)) !== undefined) {
        if(!map) throw new Error('Seed has wrong state');
        let foundMapping = map.mappings.find((m) => m.src <= seed.start && seed.start < m.src + m.range);
        if(foundMapping) {
            if(seed.start + seed.range > foundMapping.src + foundMapping.range) {
                // Range overflow, create a new range
                // const overflowedDiff = currentLocation.start + currentLocation.range - foundMapping.src + foundMapping.range;
                const inRangeDiff = foundMapping.src + foundMapping.range - seed.start;
                seedsToPlant.splice(iLocation, 0, {
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
            if(!foundMapping) {
                // The range is above all mapping
                seed.state = map.to;
                break;
            }

            // We found a mapping higher
            const outOfRangeDiff = foundMapping.src - seed.start;
            seedsToPlant.splice(iLocation, 0, {
                start: seed.start + outOfRangeDiff,
                range: seed.range - outOfRangeDiff,
                state: seed.state,
            });
            seed.range = outOfRangeDiff;
            seed.state = map.to;
        }
    }
}
seedsToPlant.sort((a, b) => a.start - b.start);
console.log(seedsToPlant[0].start); // 4917124
