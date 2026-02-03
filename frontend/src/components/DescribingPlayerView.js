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

  if (!card) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-600">Loading card...</p>
      </div>
    );
  }

  const allGuessed = guessedPhrases.length === card.phrases.length;

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-800 mb-2">You are the Describing Player</h2>
        <p className="text-blue-700">
          Describe the phrases to your team. When they guess correctly, click the phrase to pass the card!
        </p>
      </div>

      {/* Card with Phrases - Card-like UI */}
      <div className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 md:p-8 border-4 ${cardHolder === player?.team ? 'border-purple-400' : 'border-purple-300'} ${cardPassAnimation ? 'card-pass-animation' : ''}`}>
        {/* Card Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-purple-200">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-2 rounded-full mb-2">
            <span className="font-bold text-base md:text-lg">CARD #{card.id}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              cardHolder === player?.team 
                ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {cardHolder === player?.team ? '✓ Your Team Has Card' : `Card with Team ${cardHolder}`}
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mt-2">Click a phrase when your team guesses it correctly</p>
        </div>

        {/* Phrases Grid - 2 columns, 5 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {card.phrases.map((phrase, index) => {
            const isGuessed = guessedPhrases.includes(index);
            const phraseNumber = index + 1;
            return (
              <button
                key={index}
                onClick={() => handleMarkCorrect(index)}
                disabled={isGuessed}
                className={`relative group p-4 md:p-5 rounded-xl text-left transition-all transform ${
                  isGuessed
                    ? 'bg-gray-200 text-gray-500 line-through cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 cursor-pointer border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100'
                }`}
              >
                {/* Phrase Number Badge */}
                <div className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isGuessed 
                    ? 'bg-gray-400 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                }`}>
                  {phraseNumber}
                </div>
                
                {/* Phrase Text */}
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
                  {!isGuessed && (
                    <div className="mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to mark as correct
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progress: {guessedPhrases.length} / {card.phrases.length} phrases guessed
            </span>
            <span className="text-sm font-bold text-purple-600">
              {Math.round((guessedPhrases.length / card.phrases.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(guessedPhrases.length / card.phrases.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* All Guessed Message */}
        {allGuessed && (
          <div className="mt-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 text-center shadow-lg animate-pulse">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-white font-bold text-xl">
              All phrases guessed!
            </p>
            <p className="text-white text-sm mt-1">
              Both teams get a point!
            </p>
          </div>
        )}
      </div>

      {/* Recent Guesses */}
      {receivedGuesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-bold mb-2">Recent Guesses from Your Team</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {receivedGuesses.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded p-2 text-sm"
              >
                <span className="font-semibold">{item.fromPlayer}</span>
                <span className="text-gray-600">: "{item.guess}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescribingPlayerView;
