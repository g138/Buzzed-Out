import React from 'react';

const OpposingTeamView = ({ cardHolder, scores, isDescribingPlayer, player }) => {
  return (
    <div className="space-y-6 hidden">
      {/* Score Display */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 scale-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Current Scores
        </h3>
        <div className="flex justify-around items-center gap-4">
          <div className="text-center flex-1">
            <p className="text-sm md:text-base text-gray-600 mb-2 font-semibold">Team A</p>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {scores?.A || 0}
            </p>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-400">VS</div>
          <div className="text-center flex-1">
            <p className="text-sm md:text-base text-gray-600 mb-2 font-semibold">Team B</p>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {scores?.B || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpposingTeamView;
