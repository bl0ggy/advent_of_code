import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

enum SourceType {
    Number,
    Wire,
    Gate,
}
enum GateType {
    AND,
    OR,
    NOT,
    LSHIFT,
    RSHIFT,
}
type Gate =
    | { gate: GateType.AND; op1: string; op2: string }
    | { gate: GateType.OR; op1: string; op2: string }
    | { gate: GateType.NOT; op1: string }
    | { gate: GateType.LSHIFT; op1: string; op2: string }
    | { gate: GateType.RSHIFT; op1: string; op2: string };

type Source =
    | {
        type: SourceType.Number;
        value: number;
        // currentValue?: number;
    }
    | {
        type: SourceType.Wire;
        op1: string;
    }
    | (
        & {
            type: SourceType.Gate;
        }
        & Gate
        & { currentValue?: number }
    );

const wires: Map<string, Source> = new Map();

for (let i = 0; i < lines.length; i++) {
    const [gateString, wire] = lines[i].split(' -> ');
    let gate: Source;
    if (gateString.indexOf('AND') != -1) {
        const [op1, op2] = gateString.split(' AND ');
        gate = {
            type: SourceType.Gate,
            gate: GateType.AND,
            op1,
            op2,
        };
    } else if (gateString.indexOf('OR') != -1) {
        const [op1, op2] = gateString.split(' OR ');
        gate = {
            type: SourceType.Gate,
            gate: GateType.OR,
            op1,
            op2,
        };
    } else if (gateString.indexOf('NOT') != -1) {
        const [, op1] = gateString.split('NOT ');
        gate = {
            type: SourceType.Gate,
            gate: GateType.NOT,
            op1,
        };
    } else if (gateString.indexOf('LSHIFT') != -1) {
        const [op1, op2] = gateString.split(' LSHIFT ');
        gate = {
            type: SourceType.Gate,
            gate: GateType.LSHIFT,
            op1,
            op2: op2,
        };
    } else if (gateString.indexOf('RSHIFT') != -1) {
        const [op1, op2] = gateString.split(' RSHIFT ');
        gate = {
            type: SourceType.Gate,
            gate: GateType.RSHIFT,
            op1,
            op2: op2,
        };
    } else if ((gateString[0] >= '0' && gateString[0] <= '9')) { // Number
        gate = {
            type: SourceType.Number,
            value: parseInt(gateString),
        };
        // gate.currentValue = gate.value;
    } else { // Wire
        gate = {
            type: SourceType.Wire,
            op1: gateString,
        };
    }
    wires.set(wire, gate);
    // console.log(wire, gate);
}

function calculateWire(wireString: string): number {
    const wire = wires.get(wireString)!;
    if (wire.type === SourceType.Number) {
        return wire.value;
    }
    if (wire.type === SourceType.Wire) {
        return calculateWire(wire.op1);
    }
    if (wire.currentValue !== undefined) {
        return wire.currentValue;
    }

    let op1 = 0, op2 = 0;
    switch (wire.gate) {
        case GateType.AND:
            op1 = Number.isInteger(parseInt(wire.op1))
                ? parseInt(wire.op1)
                : calculateWire(wire.op1);
            op2 = Number.isInteger(parseInt(wire.op2))
                ? parseInt(wire.op2)
                : calculateWire(wire.op2);
            wire.currentValue = op1 & op2;
            return wire.currentValue;
        case GateType.OR:
            op1 = Number.isInteger(parseInt(wire.op1))
                ? parseInt(wire.op1)
                : calculateWire(wire.op1);
            op2 = Number.isInteger(parseInt(wire.op2))
                ? parseInt(wire.op2)
                : calculateWire(wire.op2);
            wire.currentValue = op1 | op2;
            return wire.currentValue;
        case GateType.NOT:
            op1 = Number.isInteger(parseInt(wire.op1))
                ? parseInt(wire.op1)
                : calculateWire(wire.op1);
            wire.currentValue = ~op1 & 0xffff;
            return wire.currentValue;
        case GateType.LSHIFT:
            op1 = Number.isInteger(parseInt(wire.op1))
                ? parseInt(wire.op1)
                : calculateWire(wire.op1);
            op2 = Number.isInteger(parseInt(wire.op2))
                ? parseInt(wire.op2)
                : calculateWire(wire.op2);
            wire.currentValue = op1 << op2;
            return wire.currentValue;
        case GateType.RSHIFT:
            op1 = Number.isInteger(parseInt(wire.op1))
                ? parseInt(wire.op1)
                : calculateWire(wire.op1);
            op2 = Number.isInteger(parseInt(wire.op2))
                ? parseInt(wire.op2)
                : calculateWire(wire.op2);
            wire.currentValue = op1 >> op2;
            return wire.currentValue;
    }
    console.log('c');
}

// for (const key of wires.keys()) {
//     console.log(`${key}: ${calculateWire(key)}`);
// }
const valueWireAPart1 = calculateWire('a');

// Reset values
for (const wire of wires.values()) {
    switch (wire.type) {
        case SourceType.Gate:
            wire.currentValue = undefined;
            break;
        case SourceType.Number:
        case SourceType.Wire:
            break;
    }
}
wires.set('b', { type: SourceType.Number, value: valueWireAPart1 });
const valueWireAPart2 = calculateWire('a');

console.log('Part 1:', valueWireAPart1); // 3176
console.log('Part 2:', valueWireAPart2); // 14710
