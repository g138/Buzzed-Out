import React from 'react';

const WinnerScreen = ({ winner, scores, onNewGame }) => {
  const isTie = winner === 'tie';
  const teamAColor = 'text-red-700';
  const teamBColor = 'text-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center scale-in">
        {/* Trophy/Confetti Animation */}
        <div className="text-8xl md:text-9xl mb-6 animate-bounce">
          {isTie ? '🤝' : '🏆'}
        </div>

        {/* Winner Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          {isTie ? 'It\'s a Tie!' : `Team ${winner} Wins!`}
        </h1>

        {/* Final Scores */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-8 border-2 border-purple-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Final Scores</h2>
          <div className="flex justify-around items-center gap-6">
            <div className={`text-center flex-1 p-4 rounded-xl ${
              !isTie && winner === 'A' ? 'bg-red-100 ring-4 ring-red-400 shadow-lg' : 'bg-red-50'
            }`}>
              <p className="text-sm md:text-base text-gray-600 mb-2 font-semibold">Team A</p>
              <p className={`text-5xl md:text-6xl font-bold ${teamAColor}`}>
                {scores?.A || 0}
              </p>
              {!isTie && winner === 'A' && (
                <p className="text-sm text-red-600 mt-2 font-semibold animate-pulse">Winner!</p>
              )}
            </div>

            <div className="text-3xl md:text-4xl font-bold text-gray-400">VS</div>

            <div className={`text-center flex-1 p-4 rounded-xl ${
              !isTie && winner === 'B' ? 'bg-blue-100 ring-4 ring-blue-400 shadow-lg' : 'bg-blue-50'
            }`}>
              <p className="text-sm md:text-base text-gray-600 mb-2 font-semibold">Team B</p>
              <p className={`text-5xl md:text-6xl font-bold ${teamBColor}`}>
                {scores?.B || 0}
              </p>
              {!isTie && winner === 'B' && (
                <p className="text-sm text-blue-600 mt-2 font-semibold animate-pulse">Winner!</p>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-lg md:text-xl text-gray-700">
            {isTie 
              ? 'Both teams played exceptionally well!'
              : `Congratulations to Team ${winner} for an amazing game!`
            }
          </p>
        </div>

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerScreen;
