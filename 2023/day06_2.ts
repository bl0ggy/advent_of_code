import { data } from './day06_data';

const [lineTime, lineDistance] = data.split('\n');

const time = parseInt(lineTime.split(':')[1].replace(/\s/g, ''), 10);
const distance = parseInt(lineDistance.split(':')[1].replace(/\s/g, ''), 10);

let maxBelow = 0;
let minAbove = Math.round(time / 2);
while(minAbove - maxBelow > 1) {
    const middle = Math.round((minAbove + maxBelow) / 2);
    const dist = middle * (time - middle + 1);
    if(dist > distance) {
        minAbove = middle;
    } else {
        maxBelow = middle;
    }
}
console.log(time - 2 * minAbove + 1); // 29432455
