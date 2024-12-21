const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'plus2', 'block'];
const wildcards = ['changeColor', 'plus4'];
const wildcardCount = 4;

let playerTurn1 = true;
let usedCards = [], unusedCards = [];
let player1DeckofCards = [], player2DeckofCards = [];
let recentCardColor = '';
let recentCardType = '';

const playerScores = {
    player1: 0,
    player2: 0,
};

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

// it dynamically reacts to changes in the DOM, and update the card if the DOM changes
const observer = new MutationObserver(() => {
    const cardImages = document.querySelectorAll('div#opponentcards img');
  
    cardImages.forEach((img) => {
      img.src = './assets/imgs/back-cover/back-cover.png';
      img.alt = 'Card back cover';
    });
});
// Observe the container for changes
const opponentCards = document.getElementById('opponentcards');
observer.observe(opponentCards, { childList: true, subtree: true });


let firstCardDropped = false; // Flag to track the first card dropped
const renderDeckAndUsedCard = (usedCard) => {
    const usedCardsContainer = document.querySelector('.used-cards');
    const stackCardsContainer = document.querySelector('.stack-cards');

    // Make sure usedCards is an array, add the usedCard
    if (!Array.isArray(usedCards)) {
        usedCards = []; 
    }

    // If the first card hasn't been dropped yet, drop it
    if (!firstCardDropped) {
        // Prevent duplicate cards from being added
        if (!usedCards.some(card => card.type === usedCard.type && card.color === usedCard.color)) {
            usedCards.push(usedCard);
            firstCardDropped = true; 
            updateRecentCard(); 
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
        for (let i = 0; i < wildcardCount; i++) {
            deck.push({ color: 'wild', type: wildcard });
        }
    }

    unusedCards.push(deck); //The variable 'deck' will be added to the global variable 'unusedCard'. 

    return deck;
};

// Function to shuffle the unused deck of cards
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

function updateRecentCard() {
    if (usedCards.length > 0) {
        const lastCard = usedCards[usedCards.length - 1];
        recentCardType = lastCard.type;
        recentCardColor = lastCard.color;
    } else {
        recentCardType = null;
        recentCardColor = null;
    }
    console.log("Updated recent card:", { recentCardType, recentCardColor });
}

// This will make the player1 deck of cards clickable.
const attachClickListener = (cardElement, card, playerDeck) => {
    if (playerTurn1) {
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
                    displayChangeColorModal();
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    updateRecentCard(); 
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    drawCardsFromDeck(4, 'player2', 'wild');
                    nextTurn()
                }

                // Rule: change color selected by player
                else if (clickedCard.type === 'changeColor') {
                    displayChangeColorModal();
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    updateRecentCard(); 
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    drawCardsFromDeck(1, 'player2', 'special');
                    nextTurn()
                }

                // Other rules...
                else if (
                    (lastCardType === 'plus4' || lastCardType === 'plus2') && // Last card is Plus4 or Plus2
                    (clickedCard.type === 'plus4' || clickedCard.type === 'plus2') // Only Plus2 or Plus4 allowed
                ) {
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    updateRecentCard(); 
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    drawCardsFromDeck(2, 'player2', 'special');
                    nextTurn()
                } 

                // Matching by color, type, or special cards
                else if (
                    clickedCard.color === recentCardColor ||
                    clickedCard.type === lastCardType ||
                    specialCardTypes.includes(clickedCard.type)
                ) {
                    if (!usedCards.some(card => card.type === clickedCard.type && card.color === clickedCard.color)) {
                        usedCards.push(clickedCard);
                    }
                    updateRecentCard(); 
                    playerTurn1 = false;
                    playerTurnListener(playerTurn1);
                    drawCardsFromDeck(1, 'player2', 'ordinary');
                    nextTurn()
                }

                // Invalid card
                else {
                    console.warn('Card does not match by color or type.');
                    cardElement.classList.add('shake');
                    setTimeout(() => cardElement.classList.remove('shake'), 500);
                    return;
                }

                // update the cards length
                let cardIndex = playerDeck.indexOf(clickedCard);
                if (cardIndex > -1) {
                    playerDeck.splice(cardIndex, 1); 
                } else {
                    console.error('Card not found in player deck!');
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
    const deckElement = document.querySelector('.stack-cards');

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
        cardElement.style.left = `${deckRect.left}px`; 
        cardElement.style.top = `${deckRect.top}px`;

        player1Container.appendChild(cardElement);

        // Attach the click event listener to each cards
        attachClickListener(cardElement, card, player1DeckofCards);

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
        cardElement.style.left = `${deckRect.left}px`; 
        cardElement.style.top = `${deckRect.top}px`;

        player2Container.appendChild(cardElement);

    });
};

// onclick of remaining
const handleDeckClick = () => {
    const { deck: updatedDeck, player1, player2 } = dealInitialCards(remainingDeck);

    // Update the remaining deck
    remainingDeck.splice(0, remainingDeck.length, ...updatedDeck);

    renderDeck(remainingDeck);
    renderPlayerCards(player1, player2);

    // Disable further clicks on the deck after the initial deal
    document.querySelector('.stack-cards').removeEventListener('click', handleDeckClick);
};
document.querySelector('.stack-cards').addEventListener('click', handleDeckClick);

const dealInitialCards = (deck) => {

    if (deck.length < 14) {
        throw new Error('Not enough cards to deal 7 to each player!');
    }

    // Deal 7 initial cards to both player
    const player1 = deck.splice(0, 7);
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
function playerTurnListener(playersTurn) {
    const player1Element = document.getElementById('player1heading');
    const player2Element = document.getElementById('player2heading');

    // Update opacity to indicate the active player
    if (playersTurn) {
        player1Element.style.opacity = '1';
        player2Element.style.opacity = '0.45';
    } else {
        player1Element.style.opacity = '0.45';
        player2Element.style.opacity = '1';
    }
}
playerTurnListener(playerTurn1);


// Pop-up modal to select color if 'changeColor' card has been drop
function displayChangeColorModal() {
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
    const overlay = document.querySelector('.changeColor-overlay');
    const modal = document.querySelector('.changeColor-modal');

    // Hide modal and overlay
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

function selectColor(selectedColor) {
    recentCardColor = selectedColor;  // Update recentCardColor with the selected color
    closeChangeColorModal();
}

//This will distribute the 7 initial cards when clicked the start button.
document.querySelector('.start-btn').addEventListener('click', () => {
    handleDeckClick();
    const unblurDeck = document.querySelector('.deck-of-cards-blur');
    const unhideCards = document.querySelector('.hide-p2-cards');
    const hideStart = document.querySelector('.start-container');

    // hide start modal
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
                currentCard.color === lastCardColor ||
                currentCard.type === lastCardType ||
                (specialCardTypes.includes(currentCard.type) && currentCard.color === lastCardColor) ||
                ((lastCardType === 'plus4' || lastCardType === 'plus2') &&
                    (currentCard.type === 'plus4' || currentCard.type === 'plus2'));

                    if (isValidDeck) {
                        // Add to usedCards and ensure no duplicates
                        if (!usedCards.some(card => card.type === currentCard.type && card.color === currentCard.color)) {
                            usedCards.push(currentCard); 
                            console.log("Player 2 played card:", currentCard);
                            
                            // Update UI immediately after adding the card
                            renderDeckAndUsedCard(currentCard);
                    
                            // Remove from deck and update UI
                            player2DeckofCards.splice(i, 1);
                            updateP2Card(player2DeckofCards);
                        }
                        updateRecentCard(); 
                    
                        // Update turn and state
                        playerTurn1 = true;
                        playerTurnListener(playerTurn1);
                        nextTurn();
                        return;
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

}

function nextTurn() {
    checkCardNumber(); //display game winner
    reshuffleUsedCards() //check an reshuffle used cards.

    if (!playerTurn1) {
        console.log("player2 turn");
        player2turn();
    } else {
        console.log("player1 turn");
    }
    playerTurn1 = !playerTurn1;
}

//update the display of the current cards. 
function updateP2Card(currentCard) {
    const player2Container = document.querySelector('#opponentcards');
    const deckElement = document.querySelector('.stack-cards');

    player2Container.innerHTML = '';

    currentCard.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`; 
        cardElement.style.top = `${deckRect.top}px`;

        player2Container.appendChild(cardElement);
    });
    playerTurn1 = true;
    playerTurnListener(playerTurn1);
    nextTurn();
}

//update the display of the current cards. 
let isUpdating = false;
function updateP1Card(currentCard) {
    if (isUpdating) return; // Prevent overlapping updates, like duplicate turns.
    isUpdating = true;

    const player1Container = document.querySelector('#yourcards');
    const deckElement = document.querySelector('.stack-cards');

    player1Container.innerHTML = ''; 

    currentCard.forEach((card) => {
        const cardElement = document.createElement('img');
        cardElement.classList.add('cardimg');
        cardElement.src = getCardImagePath(card);
        cardElement.alt = `${card.type.toUpperCase()} ${card.color.toUpperCase()}`;

        // Set initial position (deck location)
        const deckRect = deckElement.getBoundingClientRect();
        cardElement.style.left = `${deckRect.left}px`;
        cardElement.style.top = `${deckRect.top}px`;

        player1Container.appendChild(cardElement);

        // Re-attach click listener of each card.
        attachClickListener(cardElement, card, player1DeckofCards);
    });
    
    isUpdating = false; // Reset flag after updating
}

// This is to automatically get player2 or other player to draw cards based on what player1 has drawn.
function drawCardsFromDeck(numberOfCards, player, typeOfCard) {

    const drawnCards = unusedCards.splice(-numberOfCards);
    if (player !== 'player1' && typeOfCard === 'wild') {
        player2DeckofCards.push(...drawnCards);
        updateP2Card(player2DeckofCards)
    } else {
        // do something lol
    }
}

// Map player names to their corresponding HTML IDs
const playerIdMap = {
    player1: 'player1score',
    player2: 'player2score',
};

// Add score to the player
function addScore(player) {
    const overlay = document.querySelector('.gameWinner-overlay');
    const modal = document.querySelectorAll('.gameWinner-modal');
    if (!(player in playerScores)) {
        console.error(`Player "${player}" not found.`);
        return;
    }

    // Increment the score
    playerScores[player]++;

    const playerElementId = playerIdMap[player];
    const playerElement = document.getElementById(playerElementId);
    if (playerElement) {
        playerElement.textContent = playerScores[player]; //display score
        overlay.style.display = 'none';
        modal.forEach(modal=> {
            modal.style.display = 'none';
        })
        resetDeckAndDistribute();
    } else {
        console.error(`Element for "${player}" not found.`);
    }
}

document.querySelector('.stack-cards').addEventListener('click', ({ target }) => {
    if (!playerTurn1) {
        alert("It's not your turn yet!");
        return;
    }

    if (target.classList.contains('cardimg')) {
        let drawnCard = unusedCards.pop();
        player1DeckofCards.push(drawnCard);
    }

    // Only update UI without calling nextTurn here
    updateP1Card(player1DeckofCards);

    // Move turn-switching logic outside
    playerTurn1 = false;
    playerTurnListener(playerTurn1);
    nextTurn();
});


function checkCardNumber() {
    const overlay = document.querySelector('.gameWinner-overlay');
    const player1Modal = document.getElementById('win-modal');
    const player2Modal = document.getElementById('lose-modal');
    
    // Check if Player 1 wins
    if (player1DeckofCards.length === 1) {
        overlay.style.display = 'block'; 
        player1Modal.style.display = 'flex';
    }
    
    // Check if Player 2 wins
    if (player2DeckofCards.length === 1) {
        overlay.style.display = 'block'; 
        player2Modal.style.display = 'flex';
    }
}


function resetDeckAndDistribute() {
    const lastCard = usedCards.pop(); // Keep the last used card
    unusedCards.push(...usedCards); // Rebuild deck
    usedCards = [lastCard];

    shuffleDeck(unusedCards);

    // Reset and distribute cards
    player1DeckofCards = [];
    player2DeckofCards = [];
    const { deck: updatedDeck, player1, player2 } = dealInitialCards(unusedCards);
    unusedCards = updatedDeck;

    // Update UI
    renderDeck(unusedCards);
    renderPlayerCards(player1, player2);
    updateRecentCard();
}

function reshuffleUsedCards() {
    if (unusedCards.length <= 2) {
        const lastCard = usedCards.pop();
        unusedCards.push(...usedCards);
        shuffleDeck(unusedCards);
        usedCards = [lastCard];
    }
}
