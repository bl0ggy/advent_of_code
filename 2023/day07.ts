import fs from 'node:fs';
import path from 'node:path';

const currentFile: path.ParsedPath = path.parse(import.meta.filename ?? '');
const data: string = fs
    .readFileSync(`${currentFile.dir}/${currentFile.name}_input.txt`)
    .toString();
const lines = data.split('\n');
lines.pop(); // Remove empty last line

type Card = typeof listOfCards[number];
type Hand = `${Card}${Card}${Card}${Card}${Card}`;
type HandSet = {
    hand: Hand;
    bid: number;
};

const hands: HandSet[] = lines
    .map((l) => {
        const [hand, bid] = l.split(' ');
        return {
            hand: hand as HandSet['hand'],
            bid: parseInt(bid, 10),
        };
    });

/// Returns a number corresponding to the hand kind (1: High Card, 2: One Pair, ..., 7: Five of a Kind)
function getKind(a: typeof hands[0]['hand']): number {
    const fiveOfAKind: typeof listOfCards[number][] = [];
    const fourOfAKind: typeof listOfCards[number][] = [];
    const threeOfAKind: typeof listOfCards[number][] = [];
    const twoOfAKind: typeof listOfCards[number][] = [];
    for (const c of listOfCards) {
        const sameCards = a.match(new RegExp(c, 'g'))?.length || 0;
        switch (sameCards) {
            case 5:
                fiveOfAKind.push(c);
                break;
            case 4:
                fourOfAKind.push(c);
                break;
            case 3:
                threeOfAKind.push(c);
                break;
            case 2:
                twoOfAKind.push(c);
                break;
            default:
                break;
        }
    }

    if (fiveOfAKind.length === 1) return 7;
    if (fourOfAKind.length === 1) return 6;
    if (threeOfAKind.length === 1 && twoOfAKind.length === 1) return 5;
    if (threeOfAKind.length === 1) return 4;
    if (twoOfAKind.length === 2) return 3;
    if (twoOfAKind.length === 1) return 2;
    return 1;
}
/// Returns a number corresponding to the hand kind (1: High Card, 2: One Pair, ..., 7: Five of a Kind)
function getKind2(a: Hand): [number, Hand] {
    const fiveOfAKind: typeof listOfCards[number][] = [];
    const fourOfAKind: typeof listOfCards[number][] = [];
    const threeOfAKind: typeof listOfCards[number][] = [];
    const twoOfAKind: typeof listOfCards[number][] = [];
    const oneOfAKind: typeof listOfCards[number][] = [];
    let jokers: number = 0;
    for (const c of listOfCards) {
        // Starts with J
        const sameCards = a.match(new RegExp(c, 'g'))?.length || 0;
        if (c === listOfCards[0]) {
            jokers = sameCards;
            continue;
        }
        switch (sameCards) {
            case 5:
                fiveOfAKind.push(c);
                break;
            case 4:
                fourOfAKind.push(c);
                break;
            case 3:
                threeOfAKind.push(c);
                break;
            case 2:
                twoOfAKind.push(c);
                break;
            case 1:
                oneOfAKind.push(c);
                break;
            default:
                break;
        }
    }

    let updatedHand = a;

    if (jokers) {
        if (fourOfAKind.length) {
            fiveOfAKind.push(fourOfAKind[0]);
            updatedHand = updatedHand.replace(/J/g, fourOfAKind[0]);
            fourOfAKind.shift();
        } else if (threeOfAKind.length) {
            if (jokers === 2) {
                fiveOfAKind.push(threeOfAKind[0]);
            } else {
                fourOfAKind.push(threeOfAKind[0]);
            }
            updatedHand = updatedHand.replace(/J/g, threeOfAKind[0]);
            threeOfAKind.shift();
        } else if (twoOfAKind.length) {
            twoOfAKind.sort((b, c) => -compareCards(b, c));
            if (jokers === 3) {
                fiveOfAKind.push(twoOfAKind[0]);
            } else if (jokers === 2) {
                fourOfAKind.push(twoOfAKind[0]);
            } else {
                threeOfAKind.push(twoOfAKind[0]);
            }
            updatedHand = updatedHand.replace(/J/g, twoOfAKind[0]);
            twoOfAKind.shift();
        } else if (oneOfAKind.length) {
            oneOfAKind.sort((b, c) => -compareCards(b, c));
            if (jokers === 4) {
                fiveOfAKind.push(oneOfAKind[0]);
            } else if (jokers === 3) {
                fourOfAKind.push(oneOfAKind[0]);
            } else if (jokers === 2) {
                threeOfAKind.push(oneOfAKind[0]);
            } else if (jokers === 1) {
                twoOfAKind.push(oneOfAKind[0]);
            }
            updatedHand = updatedHand.replace(/J/g, oneOfAKind[0]);
            oneOfAKind.shift();
        } else if (jokers === 5) {
            fiveOfAKind.push('A');
            updatedHand = updatedHand.replace(/J/g, 'A');
        }
    }

    if (fiveOfAKind.length === 1) return [7, updatedHand];
    if (fourOfAKind.length === 1) return [6, updatedHand];
    if (threeOfAKind.length === 1 && twoOfAKind.length === 1) {
        return [5, updatedHand];
    }
    if (threeOfAKind.length === 1) return [4, updatedHand];
    if (twoOfAKind.length === 2) return [3, updatedHand];
    if (twoOfAKind.length === 1) return [2, updatedHand];
    return [1, updatedHand];
}

/// Returns a positive value if a is a better card, negative value if b is a better card, 0 if they're equal
function compareCards(a: Card, b: Card): number {
    const cmp = listOfCards.indexOf(a) - listOfCards.indexOf(b);
    return cmp;
}

/// Returns a positive value if a has a better hand, a negative value if b has a better hand, 0 if they're equal
function whoHasFirstHighestCard(a: Hand, b: Hand) {
    for (let i = 0; i < 5; i += 1) {
        const cmp = compareCards(a[i], b[i]);
        if (cmp !== 0) {
            return cmp;
        }
    }
    console.log(
        'All cards are the same, no rule for this case, should not happen.',
    );
    return 0;
}

/// Returns a positive value if a has a better hand, a negative value if b has a better hand, 0 if they're equal
function compareHands(a: HandSet, b: HandSet): number {
    const kindA = getKind(a.hand);
    const kindB = getKind(b.hand);
    if (kindA === kindB) {
        return whoHasFirstHighestCard(a.hand, b.hand);
    }

    return kindA - kindB;
}

/// Returns a positive value if a has a better hand, a negative value if b has a better hand, 0 if they're equal
function compareHands2(a: HandSet, b: HandSet): number {
    const kindA: [number, Hand] = getKind2(a.hand);
    const kindB: [number, Hand] = getKind2(b.hand);
    if (kindA[0] === kindB[0]) {
        return whoHasFirstHighestCard(a.hand, b.hand);
    }

    return kindA[0] - kindB[0];
}

let listOfCards = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A',
];
let result = hands.sort((a, b) => compareHands(a, b))
    .map((h, i) => h.bid * (i + 1))
    .reduce((a, b) => a + b);
console.log('Part 1:', result); // 250370104

listOfCards = [
    'J',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A',
];

result = hands.sort((a, b) => compareHands2(a, b))
    .map((h, i) => h.bid * (i + 1))
    .reduce((a, b) => a + b);
console.log('Part 2:', result); // 251735672
