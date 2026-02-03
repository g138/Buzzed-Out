const { v4: uuidv4 } = require('uuid');

// Dummy card data - Each card has TWO SIDES (blue and orange) with different words
// Blue side = Team A, Orange side = Team B
const CARDS = [
  {
    id: 1,
    blueSide: [ // Team A side
      "The Great Wall of China",
      "Eiffel Tower",
      "Mount Everest",
      "Statue of Liberty",
      "Pyramids of Giza",
      "Taj Mahal",
      "Machu Picchu",
      "Stonehenge",
      "Colosseum",
      "Big Ben"
    ],
    orangeSide: [ // Team B side
      "Golden Gate Bridge",
      "Sydney Opera House",
      "Christ the Redeemer",
      "Petra",
      "Angkor Wat",
      "Niagara Falls",
      "Grand Canyon",
      "Mount Fuji",
      "Leaning Tower of Pisa",
      "Buckingham Palace"
    ]
  },
  {
    id: 2,
    blueSide: [
      "Harry Potter",
      "Star Wars",
      "The Lord of the Rings",
      "Game of Thrones",
      "Breaking Bad",
      "Friends",
      "The Office",
      "Stranger Things",
      "The Simpsons",
      "SpongeBob SquarePants"
    ],
    orangeSide: [
      "The Matrix",
      "Inception",
      "The Avengers",
      "The Walking Dead",
      "Lost",
      "House of Cards",
      "Sherlock",
      "Doctor Who",
      "South Park",
      "Family Guy"
    ]
  },
  {
    id: 3,
    blueSide: [
      "Pizza",
      "Sushi",
      "Tacos",
      "Ice Cream",
      "Chocolate",
      "Pasta",
      "Burger",
      "French Fries",
      "Donuts",
      "Pancakes"
    ],
    orangeSide: [
      "Salad",
      "Soup",
      "Sandwich",
      "Steak",
      "Chicken",
      "Rice",
      "Bread",
      "Cheese",
      "Apple",
      "Banana"
    ]
  },
  {
    id: 4,
    blueSide: [
      "Basketball",
      "Soccer",
      "Tennis",
      "Swimming",
      "Cycling",
      "Running",
      "Golf",
      "Baseball",
      "Volleyball",
      "Skiing"
    ],
    orangeSide: [
      "Football",
      "Hockey",
      "Cricket",
      "Rugby",
      "Boxing",
      "Wrestling",
      "Archery",
      "Fencing",
      "Surfing",
      "Skateboarding"
    ]
  },
  {
    id: 5,
    blueSide: [
      "Guitar",
      "Piano",
      "Drums",
      "Violin",
      "Trumpet",
      "Flute",
      "Saxophone",
      "Bass",
      "Cello",
      "Harmonica"
    ],
    orangeSide: [
      "Ukulele",
      "Banjo",
      "Accordion",
      "Harp",
      "Trombone",
      "Clarinet",
      "Oboe",
      "Tuba",
      "Xylophone",
      "Tambourine"
    ]
  },
  {
    id: 6,
    blueSide: [
      "Superman",
      "Batman",
      "Spider-Man",
      "Iron Man",
      "Wonder Woman",
      "Captain America",
      "Thor",
      "Hulk",
      "Black Widow",
      "Wolverine"
    ],
    orangeSide: [
      "Flash",
      "Green Lantern",
      "Aquaman",
      "Deadpool",
      "Captain Marvel",
      "Black Panther",
      "Doctor Strange",
      "Ant-Man",
      "Hawkeye",
      "Storm"
    ]
  },
  {
    id: 7,
    blueSide: [
      "Apple",
      "Banana",
      "Orange",
      "Strawberry",
      "Grapes",
      "Watermelon",
      "Pineapple",
      "Mango",
      "Kiwi",
      "Blueberry"
    ],
    orangeSide: [
      "Cherry",
      "Peach",
      "Pear",
      "Plum",
      "Raspberry",
      "Cantaloupe",
      "Papaya",
      "Coconut",
      "Avocado",
      "Pomegranate"
    ]
  },
  {
    id: 8,
    blueSide: [
      "Dog",
      "Cat",
      "Elephant",
      "Lion",
      "Tiger",
      "Bear",
      "Dolphin",
      "Eagle",
      "Shark",
      "Penguin"
    ],
    orangeSide: [
      "Rabbit",
      "Horse",
      "Monkey",
      "Giraffe",
      "Zebra",
      "Wolf",
      "Whale",
      "Owl",
      "Octopus",
      "Kangaroo"
    ]
  },
  {
    id: 9,
    blueSide: [
      "Doctor",
      "Teacher",
      "Engineer",
      "Chef",
      "Artist",
      "Musician",
      "Athlete",
      "Pilot",
      "Scientist",
      "Lawyer"
    ],
    orangeSide: [
      "Nurse",
      "Professor",
      "Architect",
      "Baker",
      "Designer",
      "Singer",
      "Coach",
      "Captain",
      "Researcher",
      "Judge"
    ]
  },
  {
    id: 10,
    blueSide: [
      "Beach",
      "Mountain",
      "Forest",
      "Desert",
      "Ocean",
      "River",
      "Lake",
      "Island",
      "Volcano",
      "Waterfall"
    ],
    orangeSide: [
      "Valley",
      "Canyon",
      "Jungle",
      "Tundra",
      "Sea",
      "Stream",
      "Pond",
      "Peninsula",
      "Geyser",
      "Cave"
    ]
  }
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

class GameManager {
  constructor() {
    this.games = new Map();
    this.timers = new Map();
  }

  /**
   * Generate a unique 6-character game code
   */
  generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new game session
   */
  createGame() {
    let gameCode;
    do {
      gameCode = this.generateGameCode();
    } while (this.games.has(gameCode));

    const game = {
      code: gameCode,
      status: 'waiting', // waiting, playing, finished
      players: [],
      teams: {
        A: [],
        B: []
      },
      currentRound: 0,
      cardHolder: null, // 'A' or 'B' - team currently holding the card
      describingPlayers: [], // IDs of describing players [teamA_desc, teamB_desc]
      currentCard: null, // Single card with blueSide and orangeSide
      guessedPhrasesBlue: [], // Indices of guessed phrases on blue side (Team A)
      guessedPhrasesOrange: [], // Indices of guessed phrases on orange side (Team B)
      scores: {
        A: 0,
        B: 0
      },
      createdAt: Date.now()
    };

    this.games.set(gameCode, game);
    return gameCode;
  }

  /**
   * Get game by code
   */
  getGame(gameCode) {
    return this.games.get(gameCode);
  }

  /**
   * Add a player to a game
   */
  addPlayer(gameCode, socketId, playerName) {
    const game = this.games.get(gameCode);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== 'waiting') {
      throw new Error('Game already started');
    }

    // Assign to team with fewer players
    let team = 'A';
    if (game.teams.B.length < game.teams.A.length) {
      team = 'B';
    }

    const player = {
      id: uuidv4(),
      socketId,
      name: playerName,
      team,
      isReady: false
    };

    game.players.push(player);
    game.teams[team].push(player.id);

    return player;
  }

  /**
   * Start the game
   */
  startGame(gameCode) {
    const game = this.games.get(gameCode);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.players.length < 4) {
      throw new Error('Need at least 4 players');
    }

    game.status = 'playing';
    this.startRound(gameCode);
  }

  /**
   * Start a new round
   */
  startRound(gameCode) {
    const game = this.games.get(gameCode);
    game.currentRound++;
    game.guessedPhrasesBlue = [];
    game.guessedPhrasesOrange = [];

    // Randomly select starting team with card
    game.cardHolder = Math.random() < 0.5 ? 'A' : 'B';

    // Select describing players (one from each team)
    const teamAPlayers = game.players.filter(p => p.team === 'A');
    const teamBPlayers = game.players.filter(p => p.team === 'B');

    const descA = teamAPlayers[Math.floor(Math.random() * teamAPlayers.length)];
    const descB = teamBPlayers[Math.floor(Math.random() * teamBPlayers.length)];

    game.describingPlayers = [descA.id, descB.id];

    // Select ONE random card with two sides (blue and orange)
    const randomCard = CARDS[Math.floor(Math.random() * CARDS.length)];
    game.currentCard = {
      id: randomCard.id,
      blueSide: shuffleArray(randomCard.blueSide), // Shuffle blue side phrases
      orangeSide: shuffleArray(randomCard.orangeSide) // Shuffle orange side phrases
    };
  }

  /**
   * Mark a phrase as correctly guessed
   */
  markPhraseCorrect(gameCode, phraseIndex) {
    const game = this.games.get(gameCode);
    if (!game) {
      throw new Error('Game not found');
    }

    // Determine which side's phrases to check based on card holder
    const isBlueSide = game.cardHolder === 'A';
    const guessedPhrases = isBlueSide ? game.guessedPhrasesBlue : game.guessedPhrasesOrange;
    const phrases = isBlueSide ? game.currentCard.blueSide : game.currentCard.orangeSide;

    if (guessedPhrases.includes(phraseIndex)) {
      throw new Error('Phrase already guessed');
    }

    // Add to appropriate side's guessed phrases
    if (isBlueSide) {
      game.guessedPhrasesBlue.push(phraseIndex);
    } else {
      game.guessedPhrasesOrange.push(phraseIndex);
    }

    // Check if all phrases guessed on BOTH sides BEFORE passing card
    const allBlueGuessed = game.guessedPhrasesBlue.length === game.currentCard.blueSide.length;
    const allOrangeGuessed = game.guessedPhrasesOrange.length === game.currentCard.orangeSide.length;
    const allGuessed = allBlueGuessed && allOrangeGuessed;
    
    if (allGuessed) {
      // Both teams get a point if all phrases guessed before buzzer
      game.scores.A++;
      game.scores.B++;
    } else {
      // Pass card to other team (only if not all guessed)
      game.cardHolder = game.cardHolder === 'A' ? 'B' : 'A';
    }

    return { allGuessed };
  }

  /**
   * Start the hidden timer for a round
   */
  startTimer(gameCode, callback) {
    // Clear existing timer if any
    if (this.timers.has(gameCode)) {
      clearTimeout(this.timers.get(gameCode));
    }

    // Random timer between 60-120 seconds (for testing, you can adjust)
    const timerDuration = (Math.random() * 60 + 60) * 1000; // 60-120 seconds

    const timerId = setTimeout(() => {
      const game = this.games.get(gameCode);
      if (!game || game.status !== 'playing') {
        return;
      }

      // Team holding card loses, other team gets point
      const losingTeam = game.cardHolder;
      const winningTeam = losingTeam === 'A' ? 'B' : 'A';
      
      game.scores[winningTeam]++;
      
      this.timers.delete(gameCode);
      callback(winningTeam);
    }, timerDuration);

    this.timers.set(gameCode, timerId);
  }

  /**
   * Move to next round
   */
  nextRound(gameCode) {
    const game = this.games.get(gameCode);
    if (!game) {
      throw new Error('Game not found');
    }

    // Clear timer
    if (this.timers.has(gameCode)) {
      clearTimeout(this.timers.get(gameCode));
      this.timers.delete(gameCode);
    }

    this.startRound(gameCode);
  }

  /**
   * Handle player disconnection
   */
  handleDisconnect(socketId) {
    for (const [gameCode, game] of this.games.entries()) {
      const playerIndex = game.players.findIndex(p => p.socketId === socketId);
      if (playerIndex !== -1) {
        const player = game.players[playerIndex];
        
        // Remove from teams
        const teamIndex = game.teams[player.team].indexOf(player.id);
        if (teamIndex !== -1) {
          game.teams[player.team].splice(teamIndex, 1);
        }

        // Remove from players
        game.players.splice(playerIndex, 1);

        // If game becomes invalid, mark as finished
        if (game.players.length < 4 && game.status === 'playing') {
          game.status = 'finished';
        }

        // Notify other players
        // Note: In production, you'd emit this via Socket.IO
        break;
      }
    }
  }
}

module.exports = { GameManager };
