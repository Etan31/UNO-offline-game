// const cardColors = ['red', 'blue', 'green', 'yellow'];
// const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'plus4', 'block', 'changeColor'];

// const createDeck = () => {
//     const deck = [];

//     // creation of deck of cards (not random yet);
//     for(let color of cardColors){
//         for( let type of cardTypes){
//             // this will create two copies of eact type except 0 (only one)
//             if(type === '0' ){
//                 deck.push({color, type});
//             } else {
//                 deck.push({color, type});
//                 deck.push({color, type});
//             }
//         }
//     }

//     // add wildcards (changeColor & plus4) separately
//     for(let i=0; i < 4; i++){
//         deck.push({color: 'wild', type: 'changeColor'})
//         deck.push({color: 'wild', type: 'plus4'})
//     }
//     return deck;
// }
// const deck = createDeck();


// const shuffleDeck = (deck) => {

//     for(let i = deck.length -1;  i > 0; i--){
//         const j = Math.floor(Math.random() * (i + 1));
//         [deck[i], deck[j]] = [deck[j], deck[i]];
//     }
//     return deck;
// }

// const shuffledDeck = shuffleDeck(deck);

// // // Setup the starting card
// const setupInitialUsedCard = (deck) => {
//     let initialUsedCard;

//     do {
//         initialUsedCard = deck.pop();  //this will continiously get on cards and set it to used card
//     } while (initialUsedCard.color === 'wild');

//     return {deck, initialUsedCard}
// }

// const { deck: remainingDeck, initialUsedCard } = setupInitialUsedCard(shuffledDeck);


// // Step 8: Render the initial deck and used card
// const renderDeckAndUsedCard = (usedCard) => {
//     const usedCardsContainer = document.querySelector('.used-cards');
//     const stackCardsContainer = document.querySelector('.stack-cards');

//     // Display the used card
//     usedCardsContainer.innerHTML = `
//         <div class="card" style="background-color: ${usedCard.color}">
//             ${usedCard.type.toUpperCase()}
//         </div>
//     `;

//     // Display the deck stack (empty placeholder for now)
//         stackCardsContainer.innerHTML = `
//             <div class="card back"></div>
//         `;
// };

// // Step 9: Test renderDeckAndUsedCard
// renderDeckAndUsedCard(initialUsedCard);


// const renderDeck = (deck) => {
//     const deckContainer = document.querySelector('.stack-cards');
//     deckContainer.innerHTML = '';

//     // Display the deck as a stack of back-cover cards
//     for (let i = 0; i < deck.length; i++) {
//         const cardElement = document.createElement('img');
//         cardElement.src = './imgs/back-cover.png';
//         cardElement.alt = 'Card Back Cover';
//         cardElement.style.top = `${i * 2}px`; // Slightly offset each card
//         cardElement.style.left = `${i * 2}px`; // Slightly offset each card
//         deckContainer.appendChild(cardElement);
//     }
// }


const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'plus4', 'block', 'changeColor'];

const createDeck = () => {
    const deck = [];

    // Create deck of cards (not random yet)
    for (let color of cardColors) {
        for (let type of cardTypes) {
            // Create two copies of each type except '0' (only one copy)
            if (type === '0') {
                deck.push({ color, type });
            } else {
                deck.push({ color, type });
                deck.push({ color, type });
            }
        }
    }

    // Add wildcards (changeColor & plus4)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', type: 'changeColor' });
        deck.push({ color: 'wild', type: 'plus4' });
    }
    return deck;
};

const deck = createDeck();

const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const shuffledDeck = shuffleDeck(deck);

// Setup the starting card
const setupInitialUsedCard = (deck) => {
    let initialUsedCard;

    do {
        initialUsedCard = deck.pop(); // Continuously pick cards until one is not a wildcard
    } while (initialUsedCard.color === 'wild');

    return { deck, initialUsedCard };
};

const { deck: remainingDeck, initialUsedCard } = setupInitialUsedCard(shuffledDeck);

// Helper function to get the image path of a card
const getCardImagePath = (card) => {
    console.log("card color:" , card.color);
    if (card.color === 'wild') {
        // Special case for wild cards
        return `./assets/imgs/cards/special/${card.type}.png`;
    } else {
        return `./assets/imgs/cards/${card.color}/${card.type}${card.color[0]}.png`;
    }
};

// Render the initial deck and used card
const renderDeckAndUsedCard = (usedCard) => {
    const usedCardsContainer = document.querySelector('.used-cards');
    const stackCardsContainer = document.querySelector('.stack-cards');

    // Display the used card with its image
    usedCardsContainer.innerHTML = `
        <img 
            class="cardimg" 
            src="${getCardImagePath(usedCard)}" 
            alt="${usedCard.type.toUpperCase()} ${usedCard.color.toUpperCase()}" 
        />
    `;

    // Display the deck stack (placeholder for now)
    stackCardsContainer.innerHTML = `
        <img class="cardimg" src="./assets/imgs/back-cover/back-cover.png" alt="Deck Stack" />
    `;
};

// Render the remaining deck
const renderDeck = (deck) => {
    const deckContainer = document.querySelector('.stack-cards');
    deckContainer.innerHTML = '';

    // Display the deck as a stack of back-cover cards
    for (let i = 0; i < deck.length; i++) {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = './assets/imgs/back-cover/back-cover.png';
        cardElement.alt = 'Card Back Cover';
        cardElement.style.position = 'absolute';
        // cardElement.style.top = `${i * 2}px`; 
        // cardElement.style.left = `${i * 2}px`;
        deckContainer.appendChild(cardElement);
    }
};

// Initial rendering
renderDeckAndUsedCard(initialUsedCard);
renderDeck(remainingDeck);
