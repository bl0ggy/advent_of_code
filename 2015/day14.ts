import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

type Deer = {
    name: string;
    runTime: number;
    restTime: number;
    speed: number;
};
type DeerCompetition = {
    cycleTime: number;
    distance: number;
    points: number;
};

const deers: Deer[] = [];
for (const line of lines) {
    const [name, l] = line.split(' can fly ');
    const [speedStr, ll] = l.split(' km/s for ');
    const [runTimeStr, lll] = ll.split(' seconds, but then must rest for ');
    const [restTimeStr] = lll.split(' ');
    const speed = parseInt(speedStr);
    const runTime = parseInt(runTimeStr);
    const restTime = parseInt(restTimeStr);
    deers.push({ name, runTime, restTime, speed });
}
const timeToMeasure = 2503;
let maxDistance = 0;
for (const deer of deers) {
    const distance =
        Math.floor(timeToMeasure / (deer.runTime + deer.restTime)) *
            deer.runTime * deer.speed +
        Math.min(timeToMeasure % (deer.runTime + deer.restTime), deer.runTime) *
            deer.speed;
    maxDistance = Math.max(maxDistance, distance);
}

const deerScores: Map<Deer, DeerCompetition> = new Map();
for (const deer of deers) {
    deerScores.set(deer, {
        cycleTime: deer.runTime + deer.restTime,
        distance: 0,
        points: 0,
    });
}
let maxPoints = 0;
for (let i = 1; i <= timeToMeasure; i++) {
    for (const [deer, score] of deerScores) {
        if ((i - 1) % (deer.runTime + deer.restTime) < deer.runTime) {
            score.distance += deer.speed;
        }
    }
    const furthest = deerScores.values().toArray().sort((a, b) =>
        b.distance - a.distance
    )[0].distance;
    for (const [deer, score] of deerScores) {
        if (score.distance === furthest) {
            score.points++;
        }
    }
}
maxPoints =
    deerScores.values().toArray().sort((a, b) => b.points - a.points)[0].points;

console.log('Part 1:', maxDistance); // 2640
console.log('Part 2:', maxPoints); // 1102
