import React, { useState, useEffect } from 'react';

const GuessingPlayerView = ({ gameCode, socket, player, cardHolder }) => {
  const [guess, setGuess] = useState('');
  const [recentGuesses, setRecentGuesses] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleGuessSubmitted = ({ guess: g, fromPlayer, fromTeam }) => {
      setRecentGuesses(prev => [
        { guess: g, fromPlayer, fromTeam, timestamp: Date.now() },
        ...prev.slice(0, 9)
      ]);
    };

    socket.on('guessSubmitted', handleGuessSubmitted);

    return () => {
      socket.off('guessSubmitted', handleGuessSubmitted);
    };
  }, [socket]);

  const handleSubmitGuess = (e) => {
    e.preventDefault();
    if (guess.trim()) {
      socket.emit('submitGuess', { gameCode, guess: guess.trim() });
      setGuess('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
        <h2 className="text-xl font-bold text-green-800 mb-2">You are a Guessing Player</h2>
        <p className="text-green-700">
          Your team is holding the card! Listen to your describing player and submit your guesses below.
        </p>
      </div>

      {/* Guess Input */}
      <div className="bg-white rounded-lg shadow-xl p-6">
        <form onSubmit={handleSubmitGuess} className="flex gap-2">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Recent Guesses */}
      {recentGuesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold mb-2">Recent Guesses</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentGuesses.map((item, idx) => (
              <div
                key={idx}
                className={`bg-gray-50 rounded p-2 text-sm ${
                  item.fromPlayer === player.name ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <span className="font-semibold">{item.fromPlayer}</span>
                <span className="text-gray-600"> ({item.fromTeam === 'A' ? 'Team A' : 'Team B'}): </span>
                <span className="text-gray-800">"{item.guess}"</span>
                {item.fromPlayer === player.name && (
                  <span className="ml-2 text-xs text-blue-600">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waiting Message */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          Waiting for your describing player to mark a phrase as correct...
        </p>
      </div>
    </div>
  );
};

export default GuessingPlayerView;
