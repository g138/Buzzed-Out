import React, { useState, useEffect } from 'react';

const DescribingPlayerView = ({ card, guessedPhrases, gameCode, socket, cardPassAnimation, cardHolder, player }) => {
  const [receivedGuesses, setReceivedGuesses] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleGuessReceived = ({ guess, fromPlayer, fromTeam }) => {
      setReceivedGuesses(prev => [
        { guess, fromPlayer, fromTeam, timestamp: Date.now() },
        ...prev.slice(0, 9) // Keep last 10 guesses
      ]);
    };

    socket.on('guessReceived', handleGuessReceived);

    return () => {
      socket.off('guessReceived', handleGuessReceived);
    };
  }, [socket]);

  const handleMarkCorrect = (phraseIndex) => {
    if (guessedPhrases.includes(phraseIndex)) {
      return; // Already guessed
    }
    socket.emit('markCorrect', { gameCode, phraseIndex });
  };

  // Describing players don't need card data - they just mark phrases correct

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 scale-in">
        <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          You are the Describing Player
        </h2>
        <p className="text-blue-700 text-sm md:text-base">
          Your team is guessing! Listen to their guesses and mark phrases as correct when they guess them right.
        </p>
        <p className="text-blue-600 text-xs md:text-sm mt-2 bg-blue-100/50 rounded-lg p-2 inline-block">
          💡 You cannot see the card - only your guessing teammates can see it.
        </p>
      </div>

      {/* No Card Display for Describing Player */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl p-8 md:p-10 text-center border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 scale-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-7xl mb-4 animate-pulse">🎯</div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">You Cannot See The Card</h3>
        <p className="text-gray-600 mb-4 text-base md:text-lg">
          Only your guessing teammates can see the card with the phrases.
        </p>
        <p className="text-gray-700 font-semibold text-sm md:text-base bg-white/60 rounded-lg p-3 inline-block">
          Listen to their guesses and mark phrases as correct when they get them right!
        </p>
      </div>

      {/* Mark Correct Interface - Simple buttons for phrases 1-10 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 scale-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mark Phrases as Correct
        </h3>
        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
          Click a number when your team guesses that phrase correctly
        </p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
          {Array.from({ length: 10 }, (_, i) => {
            const isGuessed = guessedPhrases.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleMarkCorrect(i)}
                disabled={isGuessed}
                className={`p-4 md:p-5 rounded-xl font-bold text-lg md:text-xl transition-all duration-200 ${
                  isGuessed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60 scale-95'
                    : 'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95'
                }`}
              >
                <span className="block">{i + 1}</span>
                {isGuessed && (
                  <span className="block text-xs md:text-sm mt-1 animate-pulse">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 scale-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm md:text-base font-semibold text-gray-700">
            Progress: <span className="text-blue-600">{guessedPhrases.length}</span> / 10 phrases guessed
          </span>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {Math.round((guessedPhrases.length / 10) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out shadow-md"
            style={{ width: `${(guessedPhrases.length / 10) * 100}%` }}
          ></div>
        </div>
        {guessedPhrases.length === 10 && (
          <div className="mt-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl p-5 md:p-6 text-center shadow-xl animate-pulse scale-in">
            <p className="text-white font-bold text-lg md:text-xl">
              🎉 All phrases guessed! Both teams get a point!
            </p>
          </div>
        )}
      </div>

      {/* Recent Guesses */}
      {receivedGuesses.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-6 hover:shadow-2xl transition-all duration-300 scale-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold mb-4 text-lg md:text-xl text-gray-800">Recent Guesses from Your Team</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {receivedGuesses.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg p-3 text-sm md:text-base border border-gray-200 hover:border-blue-300 transition-all duration-200 slide-in-right"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="font-semibold text-blue-700">{item.fromPlayer}</span>
                <span className="text-gray-600">: "</span>
                <span className="text-gray-800 font-medium">{item.guess}</span>
                <span className="text-gray-600">"</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescribingPlayerView;
