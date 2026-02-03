import React, { useState, useEffect } from 'react';

const DescribingPlayerView = ({ card, guessedPhrasesBlue, guessedPhrasesOrange, gameCode, socket, cardPassAnimation, cardHolder, player }) => {
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
    // Get the correct side's guessed phrases
    const guessedPhrases = player?.team === 'A' ? guessedPhrasesBlue : guessedPhrasesOrange;
    
    if (guessedPhrases?.includes(phraseIndex)) {
      return; // Already guessed
    }
    // Only allow marking if this team is holding the card
    if (cardHolder !== player?.team) {
      return; // Not your turn
    }
    socket.emit('markCorrect', { gameCode, phraseIndex });
  };

  // Determine which side to show based on team
  const isBlueSide = player?.team === 'A';
  const phrases = card ? (isBlueSide ? card.blueSide : card.orangeSide) : [];
  const guessedPhrases = isBlueSide ? guessedPhrasesBlue : guessedPhrasesOrange;
  const sideColor = isBlueSide ? 'blue' : 'orange';
  const sideName = isBlueSide ? 'Blue' : 'Orange';

  if (!card || !phrases || phrases.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading card...</p>
      </div>
    );
  }

  const allGuessed = guessedPhrases?.length === phrases.length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className={`bg-gradient-to-r ${isBlueSide ? 'from-blue-50 to-indigo-50 border-blue-300' : 'from-orange-50 to-red-50 border-orange-300'} border-2 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 scale-in`}>
        <h2 className={`text-xl md:text-2xl font-bold ${isBlueSide ? 'text-blue-800' : 'text-orange-800'} mb-2 flex items-center gap-2`}>
          <span className="text-2xl">🎯</span>
          You are the Describing Player
        </h2>
        <p className={`${isBlueSide ? 'text-blue-700' : 'text-orange-700'} text-sm md:text-base`}>
          You can see the <span className={`font-bold ${isBlueSide ? 'text-blue-900' : 'text-orange-900'}`}>{sideName} side</span> of the card! Select any phrase and describe it to your team using only your voice (no gestures).
        </p>
        <p className={`${isBlueSide ? 'text-blue-600 bg-blue-100/50' : 'text-orange-600 bg-orange-100/50'} text-xs md:text-sm mt-2 rounded-lg p-2 inline-block`}>
          💡 Rules: Only voice descriptions allowed. Cannot use any part of the word/phrase. Mark correct when guessed!
        </p>
      </div>

      {/* Card Display - Only Describing Player Sees This */}
      <div className={`bg-gradient-to-br from-white/95 ${isBlueSide ? 'to-blue-50/40' : 'to-orange-50/40'} backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border-2 ${isBlueSide ? 'border-blue-300 hover:border-blue-400' : 'border-orange-300 hover:border-orange-400'} transition-all duration-300 scale-in ${cardPassAnimation ? 'card-pass-animation' : ''}`} style={{ animationDelay: '0.1s' }}>
        <div className={`text-center mb-6 pb-4 border-b-2 ${isBlueSide ? 'border-blue-200' : 'border-orange-200'}`}>
          <div className={`inline-block bg-gradient-to-r ${isBlueSide ? 'from-blue-600 via-indigo-600 to-blue-700' : 'from-orange-600 via-red-600 to-orange-700'} text-white px-5 md:px-7 py-2.5 rounded-full mb-3 shadow-lg`}>
            <span className="font-bold text-base md:text-lg">CARD #{card.id} - {sideName} Side</span>
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
          {phrases.map((phrase, index) => {
            const isGuessed = guessedPhrases?.includes(index) || false;
            const phraseNumber = index + 1;
            return (
              <button
                key={index}
                onClick={() => handleMarkCorrect(index)}
                disabled={isGuessed || cardHolder !== player?.team}
                className={`relative group p-4 md:p-5 rounded-xl text-left transition-all transform ${
                  isGuessed
                    ? 'bg-gray-200 text-gray-500 line-through cursor-not-allowed opacity-60 scale-95'
                    : cardHolder === player?.team 
                      ? isBlueSide
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100'
                        : 'bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 cursor-pointer border-2 border-orange-200 hover:border-orange-400 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 border-2 border-gray-200'
                }`}
              >
                {/* Phrase Number Badge */}
                <div className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isGuessed 
                    ? 'bg-gray-400 text-white' 
                    : isBlueSide
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-xl'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-xl'
                }`}>
                  {phraseNumber}
                </div>
                
                {/* Phrase Text */}
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
        <div className={`mt-6 pt-4 border-t-2 ${isBlueSide ? 'border-blue-200' : 'border-orange-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm md:text-base font-semibold text-gray-700">
              Progress: <span className={isBlueSide ? 'text-blue-600' : 'text-orange-600'}>{guessedPhrases?.length || 0}</span> / {phrases.length} phrases guessed
            </span>
            <span className={`text-lg md:text-xl font-bold bg-gradient-to-r ${isBlueSide ? 'from-blue-600 to-indigo-600' : 'from-orange-600 to-red-600'} bg-clip-text text-transparent`}>
              {Math.round(((guessedPhrases?.length || 0) / phrases.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ease-out shadow-md ${isBlueSide ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600'}`}
              style={{ width: `${((guessedPhrases?.length || 0) / phrases.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* All Guessed Message */}
        {allGuessed && (
          <div className="mt-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl p-5 md:p-6 text-center shadow-xl animate-pulse scale-in">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-white font-bold text-lg md:text-xl">
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
