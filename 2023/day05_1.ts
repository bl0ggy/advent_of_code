import { data } from './day05_data';

const blocks = data.split('\n\n');
const seedsToPlant = blocks[0].substring(7)
.split(' ')
.map((n) => parseInt(n, 10));
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

const locations: number[] = [];
for(const seed of seedsToPlant) {
    let currentLocation = seed;
    for(const map of maps) {
        for(const mapping of map.mappings) {
            if(currentLocation >= mapping.src && currentLocation <= mapping.src + mapping.range) {
                currentLocation = mapping.dst + (currentLocation - mapping.src);
                break;
            }
        }
    }
    locations.push(currentLocation);
}

locations.sort((a, b) => a - b);
console.log(locations[0]); // 993500720
