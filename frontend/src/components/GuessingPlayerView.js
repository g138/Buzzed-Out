import React, { useState, useEffect } from 'react';

const GuessingPlayerView = ({ gameCode, socket, player, cardHolder, card, guessedPhrases }) => {
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


  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 scale-in">
        <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
          <span className="text-2xl">👂</span>
          You are a Guessing Player
        </h2>
        <p className="text-green-700 text-sm md:text-base">
          Your team is holding the card! Listen to your describing player's clues and call out your guesses verbally.
        </p>
        <p className="text-green-600 text-xs md:text-sm mt-2 bg-green-100/50 rounded-lg p-2 inline-block">
          💡 Only the describing player can see the card - you cannot see it. Listen and guess!
        </p>
      </div>

      {/* Listening Indicator */}
      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl p-8 md:p-10 text-center border-2 border-green-200 hover:border-green-300 transition-all duration-300 scale-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-7xl mb-4 animate-pulse">👂</div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Listen & Guess!</h3>
        <p className="text-gray-600 text-base md:text-lg">
          Pay attention to your describing player's clues and shout out your guesses!
        </p>
      </div>

      {/* No Card Display - Guessing Players Cannot See Card */}
      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl p-8 md:p-10 text-center border-2 border-green-200 hover:border-green-300 transition-all duration-300 scale-in" style={{ animationDelay: '0.2s' }}>
        <div className="text-7xl mb-4 animate-pulse">🚫</div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">You Cannot See The Card</h3>
        <p className="text-gray-600 mb-4 text-base md:text-lg">
          Only your describing player can see the card with the phrases.
        </p>
        <p className="text-gray-700 font-semibold text-sm md:text-base bg-white/60 rounded-lg p-3 inline-block">
          Listen to your describing player's clues and call out your guesses!
        </p>
      </div>

      {/* Recent Guesses */}
      {recentGuesses.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 hover:shadow-2xl transition-all duration-300 scale-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold mb-4 text-lg md:text-xl text-gray-800">Recent Guesses</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentGuesses.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-3 text-sm md:text-base border transition-all duration-200 slide-in-right ${
                  item.fromPlayer === player.name 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300' 
                    : 'bg-gradient-to-r from-gray-50 to-green-50/50 border-gray-200 hover:border-green-300'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="font-semibold text-green-700">{item.fromPlayer}</span>
                <span className="text-gray-600"> ({item.fromTeam === 'A' ? 'Team A' : 'Team B'}): </span>
                <span className="text-gray-800 font-medium">"{item.guess}"</span>
                {item.fromPlayer === player.name && (
                  <span className="ml-2 text-xs text-blue-600 font-semibold">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waiting Message */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 scale-in" style={{ animationDelay: '0.4s' }}>
        <p className="text-yellow-800 text-sm md:text-base font-medium">
          ⏳ Waiting for your describing player to mark a phrase as correct...
        </p>
      </div>
    </div>
  );
};

export default GuessingPlayerView;
