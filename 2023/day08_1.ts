import { data } from './day08_data.ts';

const lines = data.split('\n');
const steps = lines[0].split('');
type Node = {
    'L': string
    'R': string
}
const nodes: {
    [key: string]: Node
} = {};
const nodeLines = lines.slice(2, lines.length);
for(const line of nodeLines) {
    const [node, LR] = line.split(' = ');
    const [L, R] = LR.substring(1, LR.length - 1)
    .split(', ');
    nodes[node] = { L, R };
}

let currentNode = 'AAA';
for(let i = 0; ; i += 1) {
    currentNode = nodes[currentNode][steps[i % steps.length]];
    if(currentNode === 'ZZZ') {
        console.log(i + 1); // 14681
        break;
    }
}
