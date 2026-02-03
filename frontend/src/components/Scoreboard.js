import React from 'react';

const Scoreboard = ({ scores, cardHolder }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20">
      <div className="flex justify-around items-center gap-4">
        <div className={`text-center p-5 md:p-6 rounded-2xl flex-1 transition-all duration-300 ${
          cardHolder === 'A' 
            ? 'bg-gradient-to-br from-red-100 to-red-200 ring-4 ring-red-400 shadow-lg scale-105' 
            : 'bg-gradient-to-br from-red-50 to-red-100/50 hover:shadow-md'
        }`}>
          <p className="text-sm md:text-base text-gray-700 mb-2 font-semibold">Team A</p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            {scores?.A || 0}
          </p>
          {cardHolder === 'A' && (
            <p className="text-xs md:text-sm text-red-700 mt-2 font-bold animate-pulse">🎴 Holding Card</p>
          )}
        </div>

        <div className="text-2xl md:text-3xl font-bold text-gray-400">VS</div>

        <div className={`text-center p-5 md:p-6 rounded-2xl flex-1 transition-all duration-300 ${
          cardHolder === 'B' 
            ? 'bg-gradient-to-br from-blue-100 to-blue-200 ring-4 ring-blue-400 shadow-lg scale-105' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md'
        }`}>
          <p className="text-sm md:text-base text-gray-700 mb-2 font-semibold">Team B</p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {scores?.B || 0}
          </p>
          {cardHolder === 'B' && (
            <p className="text-xs md:text-sm text-blue-700 mt-2 font-bold animate-pulse">🎴 Holding Card</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
