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
          Your team is holding the card! Listen to your describing player and call out your guesses verbally.
        </p>
        <p className="text-green-600 text-xs md:text-sm mt-2 bg-green-100/50 rounded-lg p-2 inline-block">
          💡 The describing player will mark phrases as correct when you guess them right.
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

      {/* Card Display (Read-only) - Show what phrases are being guessed */}
      {card && (
        <div className="bg-gradient-to-br from-white/95 to-green-50/40 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-green-300 hover:border-green-400 transition-all duration-300 scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-6 pb-4 border-b-2 border-green-200">
            <div className="inline-block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-5 md:px-7 py-2.5 rounded-full mb-3 shadow-lg">
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
                  className={`relative p-4 md:p-5 rounded-xl transition-all duration-300 ${
                    isGuessed
                      ? 'bg-gray-200 text-gray-500 line-through opacity-60 scale-95'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:shadow-md hover:scale-[1.02]'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isGuessed 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                  }`}>
                    {phraseNumber}
                  </div>
                  
                  <div className="pl-5 md:pl-6">
                    <span className={`font-semibold text-base md:text-lg block ${isGuessed ? 'line-through' : 'text-gray-800'}`}>
                      {phrase}
                    </span>
                    {isGuessed && (
                      <div className="mt-2 flex items-center text-green-600 animate-pulse">
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
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm md:text-base font-semibold text-gray-700">
                Progress: <span className="text-green-600">{guessedPhrases?.length || 0}</span> / {card.phrases.length} phrases guessed
              </span>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {Math.round(((guessedPhrases?.length || 0) / card.phrases.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-500 ease-out shadow-md"
                style={{ width: `${((guessedPhrases?.length || 0) / card.phrases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

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
