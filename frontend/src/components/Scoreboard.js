import React from 'react';

const Scoreboard = ({ scores, cardHolder }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex justify-around items-center">
        <div className={`text-center p-4 rounded-lg flex-1 mx-2 ${
          cardHolder === 'A' ? 'bg-red-100 ring-4 ring-red-400' : 'bg-red-50'
        }`}>
          <p className="text-sm text-gray-600 mb-1">Team A</p>
          <p className="text-3xl font-bold text-red-700">{scores?.A || 0}</p>
          {cardHolder === 'A' && (
            <p className="text-xs text-red-600 mt-1 font-semibold">Holding Card</p>
          )}
        </div>

        <div className="text-2xl font-bold text-gray-400">VS</div>

        <div className={`text-center p-4 rounded-lg flex-1 mx-2 ${
          cardHolder === 'B' ? 'bg-blue-100 ring-4 ring-blue-400' : 'bg-blue-50'
        }`}>
          <p className="text-sm text-gray-600 mb-1">Team B</p>
          <p className="text-3xl font-bold text-blue-700">{scores?.B || 0}</p>
          {cardHolder === 'B' && (
            <p className="text-xs text-blue-600 mt-1 font-semibold">Holding Card</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
