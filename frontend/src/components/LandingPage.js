import React, { useState } from 'react';

const LandingPage = ({ onCreateGame, onJoinGame, connected }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [mode, setMode] = useState(null); // 'create' or 'join'

  const handleCreate = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateGame(playerName.trim());
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (playerName.trim() && gameCode.trim()) {
      onJoinGame(gameCode.trim(), playerName.trim());
    }
  };

  if (mode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Buzzed Out
          </h1>
          <p className="text-gray-600 text-center mb-2 font-medium">
            Buzzed out online game – free multiplayer
          </p>
          <p className="text-gray-500 text-center text-sm mb-8">
            Play Buzzed Out online game with friends. Real-time multiplayer party game (Pass the Card).
          </p>

          {!connected && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              Connecting to server...
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              disabled={!connected}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Create Game
            </button>
            <button
              onClick={() => setMode('join')}
              disabled={!connected}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <button
          onClick={() => setMode(null)}
          className="text-gray-500 hover:text-gray-700 mb-4"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'create' ? 'Create New Game' : 'Join Game'}
        </h2>

        <form onSubmit={mode === 'create' ? handleCreate : handleJoin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {mode === 'join' && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Game Code
              </label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter game code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl font-bold tracking-widest uppercase"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!connected || !playerName.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {mode === 'create' ? 'Create Game' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
