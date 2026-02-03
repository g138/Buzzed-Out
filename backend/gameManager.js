const { v4: uuidv4 } = require('uuid');

// Dummy card data - in production, this would come from a database
const CARDS = [
  {
    id: 1,
    phrases: [
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
    ]
  },
  {
    id: 2,
    phrases: [
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
    ]
  },
  {
    id: 3,
    phrases: [
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
    ]
  },
  {
    id: 4,
    phrases: [
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
    ]
  },
  {
    id: 5,
    phrases: [
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
    ]
  },
  {
    id: 6,
    phrases: [
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
    ]
  },
  {
    id: 7,
    phrases: [
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
    ]
  },
  {
    id: 8,
    phrases: [
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
    ]
  },
  {
    id: 9,
    phrases: [
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
    ]
  },
  {
    id: 10,
    phrases: [
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
      cardHolder: null, // 'A' or 'B'
      describingPlayers: [], // IDs of describing players
      currentCard: null, // Card currently being played (for the team holding it)
      teamACard: null, // Card for Team A
      teamBCard: null, // Card for Team B
      guessedPhrases: [], // Indices of guessed phrases
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
    game.guessedPhrases = [];

    // Randomly select starting team with card
    game.cardHolder = Math.random() < 0.5 ? 'A' : 'B';

    // Select describing players (one from each team)
    const teamAPlayers = game.players.filter(p => p.team === 'A');
    const teamBPlayers = game.players.filter(p => p.team === 'B');

    const descA = teamAPlayers[Math.floor(Math.random() * teamAPlayers.length)];
    const descB = teamBPlayers[Math.floor(Math.random() * teamBPlayers.length)];

    game.describingPlayers = [descA.id, descB.id];

    // Select different random cards for each team and shuffle the phrases
    let cardAIndex = Math.floor(Math.random() * CARDS.length);
    let cardBIndex = Math.floor(Math.random() * CARDS.length);
    
    // Ensure teams get different cards
    while (cardBIndex === cardAIndex && CARDS.length > 1) {
      cardBIndex = Math.floor(Math.random() * CARDS.length);
    }

    const cardA = CARDS[cardAIndex];
    const cardB = CARDS[cardBIndex];

    game.teamACard = {
      id: cardA.id,
      phrases: shuffleArray(cardA.phrases) // Shuffle phrases for randomness
    };

    game.teamBCard = {
      id: cardB.id,
      phrases: shuffleArray(cardB.phrases) // Shuffle phrases for randomness
    };

    // Set the current card based on which team starts with it
    game.currentCard = game.cardHolder === 'A' ? game.teamACard : game.teamBCard;
  }

  /**
   * Mark a phrase as correctly guessed
   */
  markPhraseCorrect(gameCode, phraseIndex) {
    const game = this.games.get(gameCode);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.guessedPhrases.includes(phraseIndex)) {
      throw new Error('Phrase already guessed');
    }

    game.guessedPhrases.push(phraseIndex);

    // Pass card to other team
    game.cardHolder = game.cardHolder === 'A' ? 'B' : 'A';
    
    // Switch to the other team's card
    game.currentCard = game.cardHolder === 'A' ? game.teamACard : game.teamBCard;
    
    // Reset guessed phrases when card passes (new team, new card)
    game.guessedPhrases = [];

    // Check if all phrases guessed (using the current card)
    const allGuessed = game.guessedPhrases.length === game.currentCard.phrases.length;
    
    if (allGuessed) {
      // Both teams get a point
      game.scores.A++;
      game.scores.B++;
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
