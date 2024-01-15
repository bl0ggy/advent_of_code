import { data } from './day07_data.ts';

const listOfCards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
type Card = typeof listOfCards[number]
type Hand = `${Card}${Card}${Card}${Card}${Card}`;
type HandSet = {
    hand: Hand
    bid: number
}

const hands: HandSet[] = data.split('\n')
.map((l) => {
    const [hand, bid] = l.split(' ');
    return {
        hand: hand as HandSet['hand'],
        bid: parseInt(bid, 10),
    };
});

/// Returns a number corresponding to the hand kind (1: High Card, 2: One Pair, ..., 7: Five of a Kind)
function getKind(a: typeof hands[0]['hand']) : number {
    const fiveOfAKind: typeof listOfCards[number][] = [];
    const fourOfAKind: typeof listOfCards[number][] = [];
    const threeOfAKind: typeof listOfCards[number][] = [];
    const twoOfAKind: typeof listOfCards[number][] = [];
    for(const c of listOfCards) {
        const sameCards = a.match(new RegExp(c, 'g'))?.length || 0;
        switch(sameCards) {
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
        default: break;
        }
    }

    if(fiveOfAKind.length === 1) { return 7; }
    if(fourOfAKind.length === 1) { return 6; }
    if(threeOfAKind.length === 1 && twoOfAKind.length === 1) { return 5; }
    if(threeOfAKind.length === 1) { return 4; }
    if(twoOfAKind.length === 2) { return 3; }
    if(twoOfAKind.length === 1) { return 2; }
    return 1;
}

/// Returns a positive value if a is a better card, negative value if b is a better card, 0 if they're equal
function compareCards(a: Card, b: Card) : number {
    const cmp = listOfCards.indexOf(a) - listOfCards.indexOf(b);
    return cmp;
}

/// Returns a positive value if a has a better hand, a negative value if b has a better hand, 0 if they're equal
function whoHasFirstHighestCard(a: Hand, b: Hand) {
    for(let i = 0; i < 5; i += 1) {
        const cmp = compareCards(a[i], b[i]);
        if(cmp !== 0) {
            return cmp;
        }
    }
    console.log('All cards are the same, no rule for this case, should not happen.');
    return 0;
}

/// Returns a positive value if a has a better hand, a negative value if b has a better hand, 0 if they're equal
function compareHands(a: HandSet, b: HandSet) : number {
    const kindA = getKind(a.hand);
    const kindB = getKind(b.hand);
    if(kindA === kindB) {
        return whoHasFirstHighestCard(a.hand, b.hand);
    }

    return kindA - kindB;
}

const result = hands.sort((a, b) => compareHands(a, b))
.map((h, i) => h.bid * (i + 1))
.reduce((a, b) => a + b);
console.log(result); // 250370104
