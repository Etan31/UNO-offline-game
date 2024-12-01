const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'block'];
const wildcards = ['changeColor', 'plus4'];
const WILDCARD_COUNT = 4;

let usedCards = [];
let unusedCards = [];
let playerTurn = 1;
let playerScores = [0, 0];
let player1DeckofCards = [];
let player2DeckofCards = [];

// console.log("player1DeckofCards", player1DeckofCards);
// console.log("player2DeckofCards", player2DeckofCards);
// console.log("unusedCards:", unusedCards);
// console.log("usedCards:", usedCards);

// Helper function to get the image path of a card
const getCardImagePath = (card) => {
    const wildcards = {
        changeColor: './assets/imgs/cards/special/changecolor.png',
        plus4: './assets/imgs/cards/special/plus4.png'
    };
    
    // Check for wildcards
    if (wildcards[card.type]) {
        return wildcards[card.type];
    }

    // Handle special cards (e.g., blockred, reverseblue)
    const specialCards = ['block', 'reverse', 'plus2'];
    if (specialCards.includes(card.type)) {
        return `./assets/imgs/cards/${card.color}/${card.type}${card.color}.png`;
    }

    // Handle normal numbered cards
    return `./assets/imgs/cards/${card.color}/${card.type}${card.color[0]}.png`;
};

// Render the deck and used card
const renderDeckAndUsedCard = (usedCard) => {
    const usedCardsContainer = document.querySelector('.used-cards');
    const stackCardsContainer = document.querySelector('.stack-cards');

    usedCards = usedCard; //This will add the usedCard to the global variable usedCards

    console.log("Recently used card:", "color: ", usedCard.color, "type: ", usedCard.type);

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

// Function to create the deck
const createDeck = () => {
    const deck = [];

    for (let color of cardColors) {
        for (let type of cardTypes) {
            // Create two copies of each type except '0'
            if (type === '0') {
                deck.push({ color, type });
            } else {
                deck.push({ color, type });
                deck.push({ color, type });
            }
        }
    }

    // Add wildcards
    for (let wildcard of wildcards) {
        for (let i = 0; i < WILDCARD_COUNT; i++) {
            deck.push({ color: 'wild', type: wildcard });
        }
    }

    unusedCards.push(deck); //This the variable 'deck' will be added to the global variable 'unusedCard'. 

    return deck;
};

// Function to shuffle the deck
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

// Function to set up the initial used card
const setupInitialUsedCard = (deck) => {
    let initialUsedCard;

    do {
        initialUsedCard = deck.pop();
    } while (
        initialUsedCard.color === 'wild' || // Exclude wildcards
        ['plus2', 'plus4', 'changeColor', 'reverse', 'block'].includes(initialUsedCard.type) // Exclude special types
    );

    return { deck, initialUsedCard };
};

// Initialize and shuffle the deck
const deck = createDeck();
unusedCards = shuffleDeck(deck);

// Set up the initial used card
const { deck: remainingDeck, initialUsedCard } = setupInitialUsedCard(unusedCards);

// Update global variables
usedCards.push(initialUsedCard);
unusedCards = remainingDeck;



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
    const deckElement = document.querySelector('.stack-cards'); // Select deck element here

    // Clear existing cards
    player1Container.innerHTML = '';
    player2Container.innerHTML = '';

    const attachClickListener = (cardElement, card) => {
        cardElement.addEventListener('click', () => {
            
        });
    };


    // Render Player 1 cards with animation
    player1.forEach((card, index) => {
        player1DeckofCards.push(card);
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;  // Position based on the deck's position
        cardElement.style.top = `${deckRect.top}px`;

        player1Container.appendChild(cardElement);

        // Attach click event listener
        attachClickListener(cardElement, card);

        // Animate card after a delay. This will only add a classlist to each card to be able to animate each.
        // setTimeout(() => {
        //     cardElement.classList.add('animate');
        // }, index * 300); 
    });

    // Render Player 2 cards with animation
    player2.forEach((card, index) => {
        player2DeckofCards.push(card); 

        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;  // Position based on the deck's position
        cardElement.style.top = `${deckRect.top}px`;

        player2Container.appendChild(cardElement);

        // Animate card after a delay
        // setTimeout(() => {
        //     cardElement.classList.add('animate');
        // }, (index + 7) * 300); // Delay for each card of player 2
    });

};



// onclick of remaining
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
