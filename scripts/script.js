const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'block'];
const wildcards = ['changeColor', 'plus4'];
const WILDCARD_COUNT = 4;

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
    for (let wildcard of wildcards) {
        for (let i = 0; i < WILDCARD_COUNT; i++) {
            deck.push({ color: 'wild', type: wildcard });
        }   
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
    } while (
        initialUsedCard.color === 'wild' || // Exclude wild cards
        ['plus2', 'plus4', 'changeColor', 'reverse', 'block'].includes(initialUsedCard.type) // Exclude specific types
    );
    return { deck, initialUsedCard };
};

const { deck: remainingDeck, initialUsedCard } = setupInitialUsedCard(shuffledDeck);

// Helper function to get the image path of a card
const getCardImagePath = (card) => {
    console.log("color:", card.color, " : ", "type:", card.type);

    // Handle wild cards (changecolor and plus4)
    const wildcards = {
        changeColor: './assets/imgs/cards/special/changecolor.png',
        plus4: './assets/imgs/cards/special/plus4.png'
    };
    
    // Check for wildcards first
    if (wildcards[card.type]) {
        return wildcards[card.type];
    }

    // Handle special cards for specific colors (block, reverse, plus2)
    const specialCards = ['block', 'reverse', 'plus2'];
    if (specialCards.includes(card.type)) {
        return `./assets/imgs/cards/${card.color}/${card.type}${card.color}.png`; // e.g., blockred, reverseblue
    }

    // Handle normal numbered cards
    return `./assets/imgs/cards/${card.color}/${card.type}${card.color[0]}.png`;
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

// Render the remaining deck (not used cards, random)
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
        deckContainer.appendChild(cardElement);
    }
};

// Initial rendering
renderDeckAndUsedCard(initialUsedCard);
renderDeck(remainingDeck);


//This will get 7 initial cards at the start of the game.
const renderPlayerCards = (player1, player2) => {
    const player1Container = document.querySelector('#yourcards');
    const player2Container = document.querySelector('#opponentcards');

    // Clear existing cards
    player1Container.innerHTML = '';
    player2Container.innerHTML = '';

    // Render Player 1 cards
    player1.forEach((card) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;
        player1Container.appendChild(cardElement);
    });

    // Render Player 2 cards
    player2.forEach((card) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;
        player2Container.appendChild(cardElement);
    });
};




const handleDeckClick = () => {
    const { deck: updatedDeck, player1, player2 } = dealInitialCards(remainingDeck);

    // Update the remaining deck
    remainingDeck.splice(0, remainingDeck.length, ...updatedDeck);

    // Render the deck and player cards
    renderDeck(remainingDeck);
    renderPlayerCards(player1, player2);

    // Disable further clicks on the deck after the initial deal
    document.querySelector('.stack-cards').removeEventListener('click', handleDeckClick);
};


document.querySelector('.stack-cards').addEventListener('click', handleDeckClick);

const dealInitialCards = (deck) => {

    if (deck.length < 14) { // TODO: this should call the function that reshuffle the used cards and put it back to unused deck of card.  
        throw new Error('Not enough cards to deal 7 to each player!');
    }

    // Deal 7 cards to Player 1
    const player1 = deck.splice(0, 7);

    // Deal 7 cards to Player 2
    const player2 = deck.splice(0, 7);

    // Return the updated deck and player cards
    return {
        deck,
        player1,
        player2
    };
};
