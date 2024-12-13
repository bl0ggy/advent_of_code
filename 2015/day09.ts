import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

const distanceMap = new Map();
const cities: string[] = [];
for (const line of lines) {
    const [location, distance] = line.split(' = ');
    const [c1, c2] = location.split(' to ');
    distanceMap.set([c1, c2].sort().join(','), parseInt(distance));
    !cities.includes(c1) && cities.push(c1);
    !cities.includes(c2) && cities.push(c2);
}
cities.sort();
function calculateDistance(
    currentCity: string,
    remainingCities: string[],
    currentDistance: number,
    min: boolean,
    previousCities: string[],
): number {
    if (remainingCities.length === 0) {
        return currentDistance;
    }
    let dist = min ? 1e10 : 0;
    for (let i = 0; i < remainingCities.length; i++) {
        const newRemainingCities = remainingCities.filter((c) =>
            c != remainingCities[i]
        );
        const nextCity = remainingCities[i];
        const key = [currentCity, nextCity].sort().join(',');
        const calculatedNextDistance = calculateDistance(
            nextCity,
            newRemainingCities,
            currentDistance + distanceMap.get(key),
            min,
            [...previousCities, currentCity],
        );
        if (min) {
            dist = Math.min(
                dist,
                calculatedNextDistance,
            );
        } else {
            dist = Math.max(
                dist,
                calculatedNextDistance,
            );
        }
    }
    return dist;
}
let minDistance = 1e10;
let maxDistance = 0;
for (let i = 0; i < cities.length; i++) {
    const remainingCities = cities.filter((c) => c != cities[i]);
    minDistance = Math.min(
        minDistance,
        calculateDistance(cities[i], remainingCities, 0, true, []),
    );
    maxDistance = Math.max(
        maxDistance,
        calculateDistance(cities[i], remainingCities, 0, false, []),
    );
}

console.log('Part 1:', minDistance); // 117
console.log('Part 2:', maxDistance); // 909
