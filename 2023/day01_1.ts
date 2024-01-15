import { data } from './day01_data';

const result = data.split('\n')
.map((line) => {
    const first = line.match(/^[^0-9]*([0-9])/);
    const last = line.match(/([0-9])[^0-9]*$/);
    if(!first || !last) throw new Error('Input missing number');

    const concat = first[1] + last[1];
    return parseInt(concat, 10);
})
.reduce((a, b) => a + b);
console.log(result); // 54159
