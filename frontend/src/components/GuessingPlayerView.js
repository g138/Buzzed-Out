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
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
        <h2 className="text-xl font-bold text-green-800 mb-2">You are a Guessing Player</h2>
        <p className="text-green-700">
          Your team is holding the card! Listen to your describing player and call out your guesses verbally.
        </p>
        <p className="text-green-600 text-sm mt-2">
          The describing player will mark phrases as correct when you guess them right.
        </p>
      </div>

      {/* Listening Indicator */}
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">👂</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Listen & Guess!</h3>
        <p className="text-gray-600">
          Pay attention to your describing player's clues and shout out your guesses!
        </p>
      </div>

      {/* Card Display (Read-only) - Show what phrases are being guessed */}
      {card && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-green-300">
          <div className="text-center mb-6 pb-4 border-b-2 border-green-200">
            <div className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-2 rounded-full mb-2">
              <span className="font-bold text-base md:text-lg">CARD #{card.id}</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-2">Your team is guessing these phrases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {card.phrases.map((phrase, index) => {
              const isGuessed = guessedPhrases?.includes(index) || false;
              const phraseNumber = index + 1;
              return (
                <div
                  key={index}
                  className={`relative p-4 md:p-5 rounded-xl ${
                    isGuessed
                      ? 'bg-gray-200 text-gray-500 line-through opacity-60'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                  }`}
                >
                  <div className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isGuessed 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  }`}>
                    {phraseNumber}
                  </div>
                  
                  <div className="pl-5 md:pl-6">
                    <span className={`font-semibold text-base md:text-lg block ${isGuessed ? 'line-through' : 'text-gray-800'}`}>
                      {phrase}
                    </span>
                    {isGuessed && (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="w-4 h-4 md:w-5 md:h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs md:text-sm font-medium">Guessed!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 pt-4 border-t-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progress: {guessedPhrases?.length || 0} / {card.phrases.length} phrases guessed
              </span>
              <span className="text-sm font-bold text-green-600">
                {Math.round(((guessedPhrases?.length || 0) / card.phrases.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((guessedPhrases?.length || 0) / card.phrases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

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
