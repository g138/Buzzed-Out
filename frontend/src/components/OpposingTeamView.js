import React from 'react';

const OpposingTeamView = ({ cardHolder, scores }) => {
  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">WAIT</h2>
        <div className="text-4xl mb-4">
          {cardHolder === 'A' ? '🔴' : '🔵'}
        </div>
        <p className="text-lg font-semibold text-gray-700">
          The card is with <span className="font-bold">Team {cardHolder}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Wait for them to guess phrases or for the timer to end.
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Current Scores</h3>
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-sm text-gray-600">Team A</p>
            <p className="text-3xl font-bold text-red-700">{scores?.A || 0}</p>
          </div>
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Team B</p>
            <p className="text-3xl font-bold text-blue-700">{scores?.B || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpposingTeamView;
