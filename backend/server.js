const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GameManager } = require('./gameManager');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // Use environment variable in production
    methods: ["GET", "POST"]
  }
});

const gameManager = new GameManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new game session
  socket.on('createGame', ({ playerName }) => {
    try {
      const gameCode = gameManager.createGame();
      const game = gameManager.getGame(gameCode);
      
      // Add creator as first player
      const player = gameManager.addPlayer(gameCode, socket.id, playerName);
      
      socket.join(gameCode);
      socket.emit('gameCreated', { gameCode, player });
      console.log(`Game created: ${gameCode} by ${playerName}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Join an existing game
  socket.on('joinGame', ({ gameCode, playerName }) => {
    try {
      const game = gameManager.getGame(gameCode);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      if (game.status !== 'waiting') {
        socket.emit('error', { message: 'Game already started' });
        return;
      }

      const player = gameManager.addPlayer(gameCode, socket.id, playerName);
      socket.join(gameCode);
      
      socket.emit('gameJoined', { gameCode, player });
      io.to(gameCode).emit('playerJoined', { 
        players: game.players,
        teams: game.teams 
      });
      
      console.log(`Player ${playerName} joined game ${gameCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Start the game
  socket.on('startGame', ({ gameCode }) => {
    try {
      const game = gameManager.getGame(gameCode);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      if (game.players.length < 4) {
        socket.emit('error', { message: 'Need at least 4 players to start' });
        return;
      }

      gameManager.startGame(gameCode);
      const updatedGame = gameManager.getGame(gameCode);
      
      io.to(gameCode).emit('gameStarted', {
        round: updatedGame.currentRound,
        cardHolder: updatedGame.cardHolder,
        describingPlayers: updatedGame.describingPlayers,
        card: updatedGame.currentCard,
        currentCard: updatedGame.currentCard, // Also send as currentCard for consistency
        guessedPhrasesBlue: updatedGame.guessedPhrasesBlue,
        guessedPhrasesOrange: updatedGame.guessedPhrasesOrange,
        scores: updatedGame.scores,
        timerStarted: true
      });

      // Start the hidden timer
      gameManager.startTimer(gameCode, (winner) => {
        const currentGame = gameManager.getGame(gameCode);
        // Check if this is the last round
        if (currentGame.currentRound >= 8) {
          // Game finished - determine winner
          currentGame.status = 'finished';
          const finalWinner = currentGame.scores.A > currentGame.scores.B ? 'A' : 
                             currentGame.scores.B > currentGame.scores.A ? 'B' : 'tie';
          io.to(gameCode).emit('gameFinished', {
            winner: finalWinner,
            scores: currentGame.scores,
            round: currentGame.currentRound
          });
        } else {
          io.to(gameCode).emit('timerEnded', { 
            losingTeam: winner === 'A' ? 'B' : 'A',
            winningTeam: winner,
            cardHolder: updatedGame.cardHolder
          });
        }
      });

      console.log(`Game ${gameCode} started`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Mark a phrase as correctly guessed
  socket.on('markCorrect', ({ gameCode, phraseIndex }) => {
    try {
      const game = gameManager.getGame(gameCode);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        socket.emit('error', { message: 'Player not in game' });
        return;
      }

      // Check if player is a describing player
      if (!game.describingPlayers.includes(player.id)) {
        socket.emit('error', { message: 'Only describing players can mark phrases' });
        return;
      }

      // Check if this team is holding the card
      if (game.cardHolder !== player.team) {
        socket.emit('error', { message: 'Your team is not holding the card' });
        return;
      }

      const result = gameManager.markPhraseCorrect(gameCode, phraseIndex);
      const updatedGame = gameManager.getGame(gameCode);
      
      if (result.allGuessed) {
        // All phrases guessed - both teams get a point (already awarded in gameManager)
        io.to(gameCode).emit('allPhrasesGuessed', {
          card: updatedGame.currentCard,
          scores: updatedGame.scores,
          guessedPhrasesBlue: updatedGame.guessedPhrasesBlue,
          guessedPhrasesOrange: updatedGame.guessedPhrasesOrange
        });
      } else {
        // Card passes to other team (same card, guessed phrases persist)
        io.to(gameCode).emit('cardPassed', {
          cardHolder: updatedGame.cardHolder,
          card: updatedGame.currentCard,
          phraseIndex,
          scores: updatedGame.scores,
          guessedPhrasesBlue: updatedGame.guessedPhrasesBlue,
          guessedPhrasesOrange: updatedGame.guessedPhrasesOrange
        });
      }

      console.log(`Phrase ${phraseIndex} marked correct in game ${gameCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Submit a guess (for guessing players)
  socket.on('submitGuess', ({ gameCode, guess }) => {
    try {
      const game = gameManager.getGame(gameCode);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const player = game.players.find(p => p.socketId === socket.id);
      if (!player) {
        socket.emit('error', { message: 'Player not in game' });
        return;
      }

      // Broadcast guess to describing players
      const describingPlayerIds = game.describingPlayers;
      describingPlayerIds.forEach(descId => {
        const descPlayer = game.players.find(p => p.id === descId);
        if (descPlayer) {
          io.to(descPlayer.socketId).emit('guessReceived', {
            guess,
            fromPlayer: player.name,
            fromTeam: player.team
          });
        }
      });

      // Broadcast to all players (for display)
      io.to(gameCode).emit('guessSubmitted', {
        guess,
        fromPlayer: player.name,
        fromTeam: player.team
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Start next round
  socket.on('nextRound', ({ gameCode }) => {
    try {
      const game = gameManager.getGame(gameCode);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const result = gameManager.nextRound(gameCode);
      const updatedGame = gameManager.getGame(gameCode);
      
      if (result.gameFinished) {
        // Game finished - send winner
        io.to(gameCode).emit('gameFinished', {
          winner: result.winner,
          scores: result.scores,
          round: updatedGame.currentRound
        });
        console.log(`Game ${gameCode} finished. Winner: Team ${result.winner}`);
      } else {
        // Continue to next round
        io.to(gameCode).emit('roundStarted', {
          round: updatedGame.currentRound,
          cardHolder: updatedGame.cardHolder,
          describingPlayers: updatedGame.describingPlayers,
          card: updatedGame.currentCard,
          currentCard: updatedGame.currentCard, // Also send as currentCard for consistency
          guessedPhrasesBlue: updatedGame.guessedPhrasesBlue,
          guessedPhrasesOrange: updatedGame.guessedPhrasesOrange,
          scores: updatedGame.scores,
          timerStarted: true
        });

        // Start timer for new round
        gameManager.startTimer(gameCode, (winner) => {
          const currentGame = gameManager.getGame(gameCode);
          // Check if this is the last round
          if (currentGame.currentRound >= 8) {
            // Game finished - determine winner
            currentGame.status = 'finished';
            const finalWinner = currentGame.scores.A > currentGame.scores.B ? 'A' : 
                               currentGame.scores.B > currentGame.scores.A ? 'B' : 'tie';
            io.to(gameCode).emit('gameFinished', {
              winner: finalWinner,
              scores: currentGame.scores,
              round: currentGame.currentRound
            });
          } else {
            io.to(gameCode).emit('timerEnded', { 
              losingTeam: winner === 'A' ? 'B' : 'A',
              winningTeam: winner,
              cardHolder: updatedGame.cardHolder
            });
          }
        });

        console.log(`Round ${updatedGame.currentRound} started in game ${gameCode}`);
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    gameManager.handleDisconnect(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
