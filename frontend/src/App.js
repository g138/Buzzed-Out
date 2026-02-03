import React, { useState, useEffect } from 'react';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import LandingPage from './components/LandingPage';
import LobbyPage from './components/LobbyPage';
import GamePage from './components/GamePage';

// Main app component that uses socket
const AppContent = () => {
  const { socket, connected } = useSocket();
  const [currentView, setCurrentView] = useState('landing'); // landing, lobby, game
  const [gameCode, setGameCode] = useState(null);
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for game created
    socket.on('gameCreated', ({ gameCode: code, player: p }) => {
      setGameCode(code);
      setPlayer(p);
      // Initialize gameState with current player
      setGameState({
        players: [p],
        teams: {
          A: p.team === 'A' ? [p.id] : [],
          B: p.team === 'B' ? [p.id] : []
        }
      });
      setCurrentView('lobby');
      setError(null);
    });

    // Listen for game joined
    socket.on('gameJoined', ({ gameCode: code, player: p }) => {
      setGameCode(code);
      setPlayer(p);
      setCurrentView('lobby');
      setError(null);
    });

    // Listen for player joined (update lobby)
    socket.on('playerJoined', ({ players, teams }) => {
      setGameState(prev => ({
        ...prev,
        players: players || prev?.players || [],
        teams: teams || prev?.teams || { A: [], B: [] }
      }));
    });

    // Listen for game started
    socket.on('gameStarted', (state) => {
      // Ensure card is mapped to currentCard for consistency
      setGameState({
        ...state,
        currentCard: state.card || state.currentCard
      });
      setCurrentView('game');
      setError(null);
    });

    // Listen for round started
    socket.on('roundStarted', (state) => {
      setGameState(prev => ({
        ...prev,
        ...state,
        currentCard: state.card || state.currentCard // Ensure card is mapped correctly
      }));
    });

    // Listen for card passed
    socket.on('cardPassed', ({ cardHolder, card, phraseIndex, scores }) => {
      setGameState(prev => ({
        ...prev,
        cardHolder,
        currentCard: card,
        scores
      }));
    });

    // Listen for all phrases guessed
    socket.on('allPhrasesGuessed', ({ card, scores }) => {
      setGameState(prev => ({
        ...prev,
        currentCard: card,
        scores
      }));
    });

    // Listen for timer ended
    socket.on('timerEnded', ({ losingTeam, winningTeam, cardHolder }) => {
      setGameState(prev => ({
        ...prev,
        timerEnded: true,
        losingTeam,
        winningTeam,
        cardHolder
      }));
    });

    // Listen for errors
    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('gameCreated');
      socket.off('gameJoined');
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('roundStarted');
      socket.off('cardPassed');
      socket.off('allPhrasesGuessed');
      socket.off('timerEnded');
      socket.off('error');
    };
  }, [socket]);

  const handleCreateGame = (playerName) => {
    if (!socket || !connected) {
      setError('Not connected to server');
      return;
    }
    socket.emit('createGame', { playerName });
  };

  const handleJoinGame = (code, playerName) => {
    if (!socket || !connected) {
      setError('Not connected to server');
      return;
    }
    socket.emit('joinGame', { gameCode: code.toUpperCase(), playerName });
  };

  const handleStartGame = () => {
    if (!socket || !gameCode) return;
    socket.emit('startGame', { gameCode });
  };

  const handleNextRound = () => {
    if (!socket || !gameCode) return;
    socket.emit('nextRound', { gameCode });
    setGameState(prev => ({
      ...prev,
      timerEnded: false
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {!connected && (
        <div className="fixed top-4 left-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg z-50">
          Connecting to server...
        </div>
      )}

      {currentView === 'landing' && (
        <LandingPage
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          connected={connected}
        />
      )}

      {currentView === 'lobby' && (
        <LobbyPage
          gameCode={gameCode}
          player={player}
          gameState={gameState}
          onStartGame={handleStartGame}
          socket={socket}
        />
      )}

      {currentView === 'game' && (
        <GamePage
          gameCode={gameCode}
          player={player}
          gameState={gameState}
          socket={socket}
          onNextRound={handleNextRound}
        />
      )}
    </div>
  );
};

// Root App component with SocketProvider
const App = () => {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
};

export default App;
