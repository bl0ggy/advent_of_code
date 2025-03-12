import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const lines = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString()
    .split('\n');
lines.pop();

type Ingredient = {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
};
type Score = Omit<Ingredient, 'name'>;

const ingredients: Ingredient[] = [];
for (const line of lines) {
    const match = line.match(
        /^([a-zA-Z]+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)$/,
    );
    if (match === null) {
        process.exit(1);
    }
    ingredients.push({
        name: match[1],
        capacity: parseInt(match[2]),
        durability: parseInt(match[3]),
        flavor: parseInt(match[4]),
        texture: parseInt(match[5]),
        calories: parseInt(match[6]),
    });
}

function addIngredient(
    ingredient: Ingredient,
    teaSpoons: number,
    remainingTeaSpoons: number,
    remainingIngredients: Ingredient[],
    score: Score,
    for500calories: boolean,
): number {
    const currentScore = {
        capacity: score.capacity + ingredient.capacity * teaSpoons,
        durability: score.durability + ingredient.durability * teaSpoons,
        flavor: score.flavor + ingredient.flavor * teaSpoons,
        texture: score.texture + ingredient.texture * teaSpoons,
        calories: score.calories + ingredient.calories * teaSpoons,
    };

    if (remainingIngredients.length === 0) {
        if (remainingTeaSpoons !== 0) {
            return 0;
        }
        if (for500calories && currentScore.calories !== 500) {
            return 0;
        }
        const totalScore = Math.max(0, currentScore.capacity) *
            Math.max(0, currentScore.durability) *
            Math.max(0, currentScore.flavor) *
            Math.max(0, currentScore.texture);
        return totalScore;
    }

    let maxScore = 0;
    for (let i = 0; i <= remainingTeaSpoons; i++) {
        maxScore = Math.max(
            maxScore,
            addIngredient(
                remainingIngredients[0],
                i,
                remainingTeaSpoons - i,
                remainingIngredients.slice(1),
                currentScore,
                for500calories,
            ),
        );
    }
    return maxScore;
}

const maxScorePart1 = addIngredient(
    {
        name: '',
        capacity: 0,
        durability: 0,
        flavor: 0,
        texture: 0,
        calories: 0,
    },
    0,
    100,
    ingredients,
    {
        capacity: 0,
        durability: 0,
        flavor: 0,
        texture: 0,
        calories: 0,
    },
    false,
);
console.log('Part 1:', maxScorePart1); // 222870
const maxScorePart2 = addIngredient(
    {
        name: '',
        capacity: 0,
        durability: 0,
        flavor: 0,
        texture: 0,
        calories: 0,
    },
    0,
    100,
    ingredients,
    {
        capacity: 0,
        durability: 0,
        flavor: 0,
        texture: 0,
        calories: 0,
    },
    true,
);
console.log('Part 2:', maxScorePart2); // 117936
