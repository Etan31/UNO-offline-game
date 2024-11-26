// Define shuffleDeck before initializeGame
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
};

// Initialize the game
const initializeGame = () => {
    // Step 1: Create and shuffle the deck
    let deck = shuffleDeck(createDeck());

    // Step 2: Deal cards to players
    const { playerHand, opponentHand } = dealCards(deck);

    // Debug: Ensure each player has 7 cards
    console.log("Player's Initial Hand:", playerHand);
    console.log("Opponent's Initial Hand:", opponentHand);

    // Step 3: Display hands on the UI
    renderHand('player', playerHand);
    renderHand('opponent', opponentHand);

    // Return game state
    return { deck, playerHand, opponentHand };
};
    
    // const renderHand = (player, hand) => {
    //     const handContainer = document.getElementById(`${player}-hand`);
    //     handContainer.innerHTML = ''; // Clear existing cards
    
    //     hand.forEach((card) => {
    //     const cardElement = document.createElement('div');
    //     cardElement.className = 'card';
    //     cardElement.textContent = `${card.color} ${card.type}`; // Example format
    //     handContainer.appendChild(cardElement);
    //     });
    // };
    
    // // Initialize the game
    // let { deck, playerHand, opponentHand } = initializeGame();
    
    // // let deck = createDeck();
    


    // const cardColors = ['red', 'blue', 'green', 'yellow'];
    // const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', '+2', '+4', 'block', 'changeColor'];

    // const createDeck = () => {
    // let deck = [];

    // // Add cards to the deck
    // for (let color of cardColors) {
    //     for (let type of cardTypes) {
    //     // Add 2 copies of number cards (except for '0' that has only one copy)
    //     if (type !== '0') {
    //         deck.push({ color, type });
    //         deck.push({ color, type });
    //     } else {
    //         deck.push({ color, type });
    //     }

    //     // Special cards are added once per color
    //     if (['skip', 'reverse', '+2', 'block', 'changeColor'].includes(type)) {
    //         deck.push({ color, type });
    //     }
    //     }
    // }

    // // Add Wildcards (+4, Change Color)
    // for (let i = 0; i < 4; i++) {
    //     deck.push({ color: 'wild', type: '+4' });
    //     deck.push({ color: 'wild', type: 'changeColor' });
    // }

    // return deck;
    // };

    // const shuffleDeck = (deck) => {
    //     for (let i = deck.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [deck[i], deck[j]] = [deck[j], deck[i]];  // Swap elements
    //     }
    //     return deck;
    // };
    
    deck = shuffleDeck(deck);

    const dealCards = (deck) => {
        let playerHand = [];
        let opponentHand = [];

        for (let i = 0; i < 7; i++) {
            playerHand.push(deck.pop());  // Deal 7 cards to player
            opponentHand.push(deck.pop());  // Deal 7 cards to opponent
        }

        return { playerHand, opponentHand };
    };


    const resetDeck = (usedCards) => {
        // Exclude the last card in usedCards from reshuffling
        const lastCard = usedCards.pop();
        const newDeck = [...usedCards, lastCard];
        return shuffleDeck(newDeck);
    };

    
    let currentPlayer = 'player';  // Start with player

    const changeTurn = () => {
    currentPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
    };

    // Function to handle drawing a card when player has no valid cards to play
    const drawCard = (deck) => {
    if (deck.length === 0) {
        deck = resetDeck(usedCards);  // Reset deck when it's empty
    }
    return deck.pop();  // Draw card from deck
    };


    const handleSpecialCard = (card, topCard) => {
        if (card.type === 'skip') {
        changeTurn();  // Skip the opponent's turn
        }
        if (card.type === 'reverse') {
        // Reverse turn order (applicable only in multiplayer)
        }
        if (card.type === '+2') {
        // Opponent draws 2 cards
        opponentHand.push(drawCard(deck), drawCard(deck));
        }
        if (card.type === '+4') {
        // Opponent draws 4 cards and player picks a color
        opponentHand.push(drawCard(deck), drawCard(deck), drawCard(deck), drawCard(deck));
        // Prompt the player to choose a color
        }
        if (card.type === 'block') {
        changeTurn();  // Block opponent's turn
        }
        if (card.type === 'changeColor') {
        // Prompt player to select a new color
        }
    };

    
    let playerScore = 0;
    let opponentScore = 0;
    
    const updateScore = () => {
        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('opponent-score').textContent = opponentScore;
    };
    
    const incrementScore = (winner) => {
        if (winner === 'player') {
        playerScore++;
        } else {
        opponentScore++;
        }
        updateScore();
    };


    // Define shuffleDeck before initializeGame


// Define other functions and variables
const cardColors = ['red', 'blue', 'green', 'yellow'];
const cardTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', '+2', '+4', 'block', 'changeColor'];

const createDeck = () => {
    let deck = [];
    // Add cards to the deck
    for (let color of cardColors) {
        for (let type of cardTypes) {
            if (type !== '0') {
                deck.push({ color, type });
                deck.push({ color, type });
            } else {
                deck.push({ color, type });
            }
            if (['skip', 'reverse', '+2', 'block', 'changeColor'].includes(type)) {
                deck.push({ color, type });
            }
        }
    }
    // Add Wildcards (+4, Change Color)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', type: '+4' });
        deck.push({ color: 'wild', type: 'changeColor' });
    }
    return deck;
};

// const dealCards = (deck) => {
//     let playerHand = [];
//     let opponentHand = [];
//     for (let i = 0; i < 7; i++) {
//         playerHand.push(deck.pop());
//         opponentHand.push(deck.pop());
//     }
//     return { playerHand, opponentHand };
// };

const renderHand = (player, hand) => {
    const handContainer = document.getElementById(`${player}-hand`);
    handContainer.innerHTML = ''; // Clear existing cards
    hand.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.color} ${card.type}`; // Example format
        handContainer.appendChild(cardElement);
    });
};

// Call initializeGame
let { deck, playerHand, opponentHand } = initializeGame();
