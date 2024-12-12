import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();
const grid = lines.map((l) => l.split(''));

type Vector = { x: number; y: number };
type FenceCell = { top: number; left: number; right: number; bottom: number };
const fieldMap: Map<string, Vector[]> = new Map();

function propagateNewFieldId(fieldId: string, newFieldId: string, pos: Vector) {
    if (
        pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 ||
        pos.y >= grid.length
    ) {
        return;
    }
    if (grid[pos.y][pos.x] !== fieldId) {
        return;
    }

    grid[pos.y][pos.x] = newFieldId;
    fieldMap.get(newFieldId)!.push({ x: pos.x, y: pos.y });

    propagateNewFieldId(fieldId, newFieldId, { x: pos.x, y: pos.y - 1 });
    propagateNewFieldId(fieldId, newFieldId, { x: pos.x - 1, y: pos.y });
    propagateNewFieldId(fieldId, newFieldId, { x: pos.x, y: pos.y + 1 });
    propagateNewFieldId(fieldId, newFieldId, { x: pos.x + 1, y: pos.y });
}

let currentFieldId = 0;
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if ('A' <= grid[y][x] && grid[y][x] <= 'Z') {
            fieldMap.set(currentFieldId.toString(), []);
            propagateNewFieldId(grid[y][x], currentFieldId.toString(), {
                x,
                y,
            });
            currentFieldId++;
        }
    }
}

const perimeterGrid: (undefined | FenceCell)[][] = [];
for (let y = 0; y < grid.length; y++) {
    const line = [];
    for (let x = 0; x < grid[0].length; x++) {
        line.push(undefined);
    }
    perimeterGrid.push(line);
}

let totalPricePart1 = 0;
let totalPricePart2 = 0;
for (const [fieldId, positions] of fieldMap.entries()) {
    let perimeter = 0;
    let currentFenceId = 0;
    const area = positions.length;
    for (
        const pos of positions.sort((a, b) =>
            a.y !== b.y ? a.y - b.y : a.x - b.x
        )
    ) {
        // Part 1
        perimeter += pos.x <= 0 || grid[pos.y][pos.x - 1] !== fieldId ? 1 : 0;
        perimeter +=
            pos.x >= grid[0].length - 1 || grid[pos.y][pos.x + 1] !== fieldId
                ? 1
                : 0;
        perimeter += pos.y <= 0 || grid[pos.y - 1][pos.x] !== fieldId ? 1 : 0;
        perimeter +=
            pos.y >= grid.length - 1 || grid[pos.y + 1][pos.x] !== fieldId
                ? 1
                : 0;

        // Part 2
        const hasTopField = pos.y > 0 && grid[pos.y - 1][pos.x] === fieldId;
        const topField =
            hasTopField && perimeterGrid[pos.y - 1][pos.x] !== undefined
                ? perimeterGrid[pos.y - 1][pos.x]
                : undefined;
        const hasLeftField = pos.x > 0 && grid[pos.y][pos.x - 1] === fieldId;
        const leftField = hasLeftField &&
                perimeterGrid[pos.y][pos.x - 1] !== undefined
            ? perimeterGrid[pos.y][pos.x - 1]
            : undefined;
        const hasBottomField = pos.y < grid.length - 1 &&
            grid[pos.y + 1][pos.x] === fieldId;
        const hasRightField = pos.x < grid[0].length - 1 &&
            grid[pos.y][pos.x + 1] === fieldId;

        const fences: FenceCell = { top: -1, left: -1, right: -1, bottom: -1 };
        if (hasLeftField) {
            fences.left = -1;
        } else if (topField && topField.left !== -1) {
            fences.left = topField.left;
        } else {
            fences.left = currentFenceId++;
        }
        if (hasRightField) {
            fences.right = -1;
        } else if (topField && topField.right !== -1) {
            fences.right = topField.right;
        } else {
            fences.right = currentFenceId++;
        }
        if (hasTopField) {
            fences.top = -1;
        } else if (leftField && leftField.top !== -1) {
            fences.top = leftField.top;
        } else {
            fences.top = currentFenceId++;
        }
        if (hasBottomField) {
            fences.bottom = -1;
        } else if (leftField && leftField.bottom !== -1) {
            fences.bottom = leftField.bottom;
        } else {
            fences.bottom = currentFenceId++;
        }
        perimeterGrid[pos.y][pos.x] = fences;
    }
    totalPricePart1 += area * perimeter;
    totalPricePart2 += area * currentFenceId;
}
console.log('Part 1:', totalPricePart1); // 1387004
console.log('Part 2:', totalPricePart2); // 844198
