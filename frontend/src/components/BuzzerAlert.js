import React from 'react';

const BuzzerAlert = ({ losingTeam, winningTeam, onClose, onNextRound, currentRound, maxRounds = 8 }) => {
  const isLastRound = currentRound >= maxRounds;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center buzzer-active">
        <div className="text-6xl mb-4">🔔</div>
        <h2 className="text-3xl font-bold text-red-600 mb-4">BUZZER!</h2>
        <div className="bg-red-100 rounded-lg p-4 mb-4">
          <p className="text-lg font-semibold text-red-700">
            Team {losingTeam} was holding the card!
          </p>
          <p className="text-2xl font-bold text-red-800 mt-2">
            Team {losingTeam} loses
          </p>
        </div>
        <div className="bg-green-100 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-green-700">
            Team {winningTeam} gets a point!
          </p>
        </div>
        {isLastRound ? (
          <div className="bg-yellow-100 rounded-lg p-4 mb-4">
            <p className="text-lg font-semibold text-yellow-800">
              This was the final round! Game Over!
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Round {currentRound} of {maxRounds}
          </p>
        )}
        <button
          onClick={() => {
            onClose();
            if (!isLastRound) {
              onNextRound();
            }
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
        >
          {isLastRound ? 'View Results' : 'Next Round'}
        </button>
      </div>
    </div>
  );
};

export default BuzzerAlert;
