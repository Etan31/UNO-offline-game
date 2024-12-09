const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'block'];
const wildcards = ['changeColor', 'plus4'];
const WILDCARD_COUNT = 4;

let playerTurn1 = true;
let usedCards = [], unusedCards = [];
let player1Scores = 0, player2Scores = 0;
let player1DeckofCards = [], player2DeckofCards = [];
let recentCardColor = '';
let recentCardType = '';

// To the image path of a card
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

let firstCardDropped = false; // Flag to track the first card dropped

const renderDeckAndUsedCard = (usedCard) => {
    const usedCardsContainer = document.querySelector('.used-cards');
    const stackCardsContainer = document.querySelector('.stack-cards');

    // Make sure usedCards is an array, add the usedCard
    if (!Array.isArray(usedCards)) {
        usedCards = [];  // Reset if not an array
    }

    // If the first card hasn't been dropped yet, drop it
    if (!firstCardDropped) {
        // Prevent duplicate cards from being added
        if (!usedCards.some(card => card.type === usedCard.type && card.color === usedCard.color)) {
            usedCards.push(usedCard);
            firstCardDropped = true; // Mark that the first card has been dropped
        } else {
            console.log('Card already used:', usedCard);
        }
    }

    // Display all used cards
    usedCardsContainer.innerHTML = ''; // Clear the previous contents before rendering (if any)
    usedCards.forEach(card => {
        const cardImgElement = document.createElement('img');
        cardImgElement.classList.add('cardimg');
        cardImgElement.src = getCardImagePath(card);
        cardImgElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        usedCardsContainer.appendChild(cardImgElement);
    });

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

    for (let wildcard of wildcards) {
        for (let i = 0; i < WILDCARD_COUNT; i++) {
            deck.push({ color: 'wild', type: wildcard });
        }
    }

    unusedCards.push(deck); //The variable 'deck' will be added to the global variable 'unusedCard'. 

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
        recentCardColor = initialUsedCard.color;
        recentCardType = initialUsedCard.type;
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

// Update global variables
usedCards.push(initialUsedCard);
unusedCards = remainingDeck;
// Initial rendering
renderDeckAndUsedCard(initialUsedCard);
renderDeck(remainingDeck);

console.log("usedCards: ", usedCards);

//This will get 7 initial cards at the start of the game.
// Function to attach click listener and update used cards
const attachClickListener = (cardElement, card, playerDeck) => {
    if (player1turn) {
        cardElement.addEventListener('click', () => {
            if (playerDeck.length > 0) {
                let clickedCard = card;

                // Ensure usedCards is an array before pushing
                if (!Array.isArray(usedCards)) {
                    console.error('usedCards is not an array, resetting it to an empty array.');
                    usedCards = [];
                }

                // Get last card information
                let lastCard = usedCards.length > 0 ? lastUsedCard(usedCards) : null;
                let [lastCardColor, lastCardType] = lastCard;
                const specialCardTypes = ['plus2', 'plus4', 'reverse', 'changeColor'];

                // Rule: Plus4 can always be dropped
                if (clickedCard.type === 'plus4') {
                    console.log('Plus4 card can always be played.');
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    nextTurn()
                }

                // Rule: change color selected by player
                else if (clickedCard.type === 'changeColor') {
                    displayChangeColorModal();
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    nextTurn()
                }

                // Other rules...
                else if (
                    (lastCardType === 'plus4' || lastCardType === 'plus2') && // Last card is Plus4 or Plus2
                    (clickedCard.type === 'plus4' || clickedCard.type === 'plus2') // Only Plus2 or Plus4 allowed
                ) {
                    console.log('Special rule: Plus2 or Plus4 match.');
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    nextTurn()
                } 

                // Matching by color, type, or special cards
                else if (
                    clickedCard.color === recentCardColor ||
                    clickedCard.type === lastCardType ||
                    specialCardTypes.includes(clickedCard.type)
                ) {
                    console.log('matched by color or type or special card: ', usedCards);
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    nextTurn()
                }

                // Invalid card
                else {
                    console.warn('Card does not match by color or type.');
                    cardElement.classList.add('shake');
                    setTimeout(() => cardElement.classList.remove('shake'), 500);
                    return;
                }

                renderDeckAndUsedCard(clickedCard);
                cardElement.remove(); // Remove card visually
            } else {
                console.warn('No more cards in the deck.');
            }
        });
    } else {
        alert('Not player1 turn');
    }
};





// This will distribute and display the random deck of card to the players. 
const renderPlayerCards = (player1, player2) => {
    const player1Container = document.querySelector('#yourcards');
    const player2Container = document.querySelector('#opponentcards');
    const deckElement = document.querySelector('.stack-cards'); // Select deck element here

    // Clear existing cards
    player1Container.innerHTML = '';
    player2Container.innerHTML = '';

    // Render Player 1 cards with animation
    player1.forEach((card, index) => {
        player1DeckofCards.push(card);  // Add the card to player1's deck

        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;  // Position based on the deck's position
        cardElement.style.top = `${deckRect.top}px`;

        player1Container.appendChild(cardElement);

        // Attach the click event listener
        attachClickListener(cardElement, card, player1DeckofCards);

    });

    // Render Player 2 cards with animation
    player2.forEach((card, index) => {
        player2DeckofCards.push(card);  // Add the card to player2's deck
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;  // Position based on the deck's position
        cardElement.style.top = `${deckRect.top}px`;

        player2Container.appendChild(cardElement);

    });
    // console.log("player2cards: ",player2DeckofCards);
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

// This will return the last card from the deck of used cards.
function lastUsedCard(usedCards) {
    let lastcardInfo = usedCards[usedCards.length - 1];
    let cardColor = lastcardInfo.color;
    let cardType = lastcardInfo.type;

    return [cardColor, cardType];
}

// when changing their move to drop cards.
function playerTurnListener(playerTurn1) {
    const player1Element = document.getElementById('player1');
    const player2Element = document.getElementById('player2');

    // Update opacity to indicate the active player
    if (playerTurn1) {
        player1Element.style.opacity = '1';
        player2Element.style.opacity = '0.45';
    } else {
        player1Element.style.opacity = '0.45';
        player2Element.style.opacity = '1';
    }

    // // Enable valid cards and disable invalid ones
    // const cardElements = document.querySelectorAll('.cardImg'); // Cards have the class "cardImg"
    // const lastCard = usedCards.length > 0 ? lastUsedCard(usedCards) : null;

    // cardElements.forEach((cardElement) => {
    //     const cardData = JSON.parse(cardElement.dataset.card); // Assuming card data is in a `data-card` attribute
    //     let isValid = false; // Default to invalid

    //     if (lastCard) {
    //         const [lastCardColor, lastCardType] = lastCard;
    //         const specialCardTypes = ['plus2', 'plus4', 'reverse', 'changeColor'];

    //         // Determine validity based on game rules
    //         isValid =
    //             cardData.type === 'plus4' || // Plus4 can always be played
    //             cardData.color === recentCardColor || // Matches color
    //             cardData.type === lastCardType || // Matches type
    //             (specialCardTypes.includes(cardData.type) && cardData.color === recentCardColor) || // Special card matches color
    //             ((lastCardType === 'plus4' || lastCardType === 'plus2') && // Special case: Plus4/Plus2 rules
    //                 (cardData.type === 'plus4' || cardData.type === 'plus2'));
    //     } else {
    //         isValid = true;
    //     }

    // });
}
playerTurnListener(playerTurn1);


// Pop-up modal to select color if 'changeColor' card has been drop
function displayChangeColorModal() {
    // Select modal and overlay elements
    const overlay = document.querySelector('.changeColor-overlay');
    const modal = document.querySelector('.changeColor-modal');

    // Show modal and overlay
    overlay.style.display = 'block';
    modal.style.display = 'flex';


    // Attach event listeners to color buttons
    document.getElementById('red').addEventListener('click', () => selectColor('red'));
    document.getElementById('green').addEventListener('click', () => selectColor('green'));
    document.getElementById('blue').addEventListener('click', () => selectColor('blue'));
    document.getElementById('yellow').addEventListener('click', () => selectColor('yellow'));
}

function closeChangeColorModal() {
    // Select modal and overlay elements
    const overlay = document.querySelector('.changeColor-overlay');
    const modal = document.querySelector('.changeColor-modal');

    // Hide modal and overlay
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

function selectColor(selectedColor) {
    recentCardColor = selectedColor;  // Update recentCardColor with the selected color
    console.log('Updated recentCardColor:', recentCardColor);
    closeChangeColorModal();
}

//This will distribute the 7 initial cards when clicked the start button.
document.querySelector('.start-btn').addEventListener('click', () => {
    handleDeckClick();
    const unblurDeck = document.querySelector('.deck-of-cards-blur');
    const unhideCards = document.querySelector('.hide-p2-cards');
    const hideStart = document.querySelector('.start-container');

    if (unblurDeck && hideStart && unhideCards) {
        unblurDeck.classList.remove('deck-of-cards-blur');
        unhideCards.classList.remove('hide-p2-cards');
        hideStart.classList.add('hide-start');
    } else {
        console.log("Either 'deck-of-cards-blur' class, start button, or cards are available.")
    }
});


// Game Rules/Info modal
function displayGameInfoModal() {
    const modal = document.querySelector('.gameInfo-modal');
    const overlay = document.querySelector('.gameInfo-overlay');

    overlay.style.display = 'block';
    modal.style.display = 'flex';
}

function hideGameInfoModal() {
    const modal = document.querySelector('.gameInfo-modal');
    const overlay = document.querySelector('.gameInfo-overlay');

    overlay.style.display = 'none';
    modal.style.display = 'none';
}

let currentRuleIndex = 0; // display the first rule.
const rules = document.querySelectorAll('.rules');

showRule(currentRuleIndex);
function showRule(index) {
    const leftButton = document.querySelector('.left-toggle');
    const rightButton = document.querySelector('.right-toggle');

    leftButton.style.display = currentRuleIndex === 0 ? 'none' : 'flex';
    rightButton.style.display = currentRuleIndex === rules.length - 1 ? 'none' : 'flex';

    rules.forEach(rule => rule.style.display = 'none'); //hide all rules
    rules[index].style.display = 'flex'; // display the current rule
}


// Function to handle left toggle
function toggleLeftrules() {
    if (currentRuleIndex > 0) {
        currentRuleIndex--; // Move to the previous rule
        showRule(currentRuleIndex);
    }
}

// Function to handle right toggle
function toggleRightrules() {
    if (currentRuleIndex < rules.length - 1) {
        currentRuleIndex++; // Move to the next rule
        showRule(currentRuleIndex);
    }
}

function player1turn() {
    console.log("Player 1's turn");
}

function player2turn() {
    let isValidDeck = false;
    const lastCard = usedCards.length > 0 ? lastUsedCard(usedCards) : null;

    for (let i = 0; i < player2DeckofCards.length; i++) {
        const currentCard = player2DeckofCards[i];
        if (lastCard) {
            const [lastCardColor, lastCardType] = lastCard;
            const specialCardTypes = ['plus2', 'plus4', 'reverse', 'changeColor'];

            isValidDeck =
                currentCard.type === 'plus4' ||
                currentCard.color === recentCardColor ||
                currentCard.type === lastCardType ||
                (specialCardTypes.includes(currentCard.type) && currentCard.color === recentCardColor) ||
                ((lastCardType === 'plus4' || lastCardType === 'plus2') &&
                    (currentCard.type === 'plus4' || currentCard.type === 'plus2'));

            if (isValidDeck) {
                if (!usedCards.some(card => card.type === currentCard.type && card.color === currentCard.color)) {
                    usedCards.push(currentCard);
                }
                playerTurn1 = true;
                playerTurnListener(playerTurn1);
                nextTurn();
                break;
            }

        } else {
            isValidDeck = false;
            console.log(`No last card; all cards are valid. Valid card: ${JSON.stringify(currentCard)}`);
            break;
        }
    }

    if (!isValidDeck) {
        const getunusedCard = remainingDeck.pop();
        player2DeckofCards.push(getunusedCard);
        updateP2Card(player2DeckofCards);
    }

    console.log("Is there a valid card of Player 2? ", isValidDeck);
}

function nextTurn() {
    if (!playerTurn1) {
        console.log("player2 turn");
        player2turn();
    } else {
        console.log("player1 turn");
    }
    playerTurn1 = !playerTurn1;
}


function updateP2Card(currentCard) {
    const player2Container = document.querySelector('#opponentcards');
    const deckElement = document.querySelector('.stack-cards'); // Select deck element here

    player2Container.innerHTML = '';

    currentCard.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;  // Position based on the deck's position
        cardElement.style.top = `${deckRect.top}px`;

        player2Container.appendChild(cardElement);
    });
    playerTurn1 = true;
    playerTurnListener(playerTurn1);
    nextTurn();
}