import { data } from './day08_data.ts';

// Not done, I'm not okay with a so specific case of looping paths

// const lines = data.split('\n');
// const steps = lines[0].split('');
// type Node = {
//     'L': string
//     'R': string
// }
// const nodes: {
//     [key: string]: Node
// } = {};
//
// const nodeLines = lines.slice(2, lines.length);
// const currentNodes: string[] = [];
// for(const line of nodeLines) {
//     const [node, LR] = line.split(' = ');
//     const [L, R] = LR.substring(1, LR.length - 1)
//     .split(', ');
//     nodes[node] = { L, R };
//     if(node[2] === 'A') {
//         currentNodes.push(node);
//     }
// }
// console.log(currentNodes);
//
// for(let i = 0; ; i += 1) {
//     let allZs = true;
//     for(let n = 0; n < currentNodes.length; n += 1) {
//         // console.log(n, 'current', nodes[currentNodes[n]]);
//         currentNodes[n] = nodes[currentNodes[n]][steps[i % steps.length]];
//         // console.log(n, 'new    ', currentNodes[n]);
//         if(currentNodes[n][2] !== 'Z') {
//             allZs = false;
//         }
//     }
//     if(currentNodes.filter((n) => n[2] === 'Z').length > 2) {
//         console.log(i, currentNodes);
//     }
//
//     if(allZs) {
//         console.log(i + 1); //
//         break;
//     }
// }

// const step2 = steps.map((s) => (s === 'L' ? 0 : 1));
//
// const nodesMap: {
//     [key: string]: number
// } = {};
// const currentNodes: number[] = [];
// const endingNodes: number[] = [];
// for(const [index, line] of nodeLines.entries()) {
//     const node = line.split(' = ')[0];
//     nodesMap[node] = index;
//     if(line[2] === 'A') {
//         // console.log('A', node, index);
//         currentNodes.push(nodesMap[node]);
//     } else if(line[2] === 'Z') {
//         // console.log('Z', node, index);
//         endingNodes.push(nodesMap[node]);
//     }
// }
// // console.log(nodesMap);
// // console.log(currentNodes);
// // console.log(endingNodes);
// // process.exit(0);
// type Node = [number, number]
// const nodes: Node[] = [];
// for(const line of nodeLines) {
//     const [node, LR] = line.split(' = ');
//     const [L, R] = LR.substring(1, LR.length - 1)
//     .split(', ');
//     nodes[nodesMap[node]] = [nodesMap[L], nodesMap[R]];
// }
// console.log(nodes);
//
// for(let i = 0; ; i += 1) {
//     let allZs = true;
//     for(let n = 0; n < currentNodes.length; n += 1) {
//         // console.log(n, 'current', nodes[currentNodes[n]]);
//         currentNodes[n] = nodes[currentNodes[n]][step2[n]];
//         // console.log(n, 'new    ', currentNodes[n]);
//         if(endingNodes.indexOf(currentNodes[n]) === -1) {
//             allZs = false;
//         }
//     }
//     if(currentNodes.filter((n) => endingNodes.indexOf(n) !== -1).length > 4) {
//         console.log(i, currentNodes);
//     }
//
//     if(allZs) {
//         console.log(i + 1); //
//         break;
//     }
// }
