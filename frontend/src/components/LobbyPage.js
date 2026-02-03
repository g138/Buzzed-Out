import React, { useState, useEffect } from 'react';

const LobbyPage = ({ gameCode, player, gameState, onStartGame, socket }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState({ A: [], B: [] });

  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = ({ players: p, teams: t }) => {
      setPlayers(p);
      setTeams(t);
    };

    socket.on('playerJoined', handlePlayerJoined);

    // Request current game state
    if (gameState) {
      setPlayers(gameState.players || []);
      setTeams(gameState.teams || { A: [], B: [] });
    }

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, [socket, gameState]);

  const canStart = players.length >= 4;
  const isCreator = players.length > 0 && players[0]?.socketId === socket?.id;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Game Lobby
        </h1>

        {/* Game Code Display */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-600 mb-2">Game Code</p>
          <p className="text-4xl font-bold tracking-widest text-purple-700">
            {gameCode}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Share this code with other players
          </p>
        </div>

        {/* Teams Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Team A */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h3 className="font-bold text-red-700 mb-3 text-lg">Team A</h3>
            <div className="space-y-2">
              {teams.A?.map((playerId) => {
                const p = players.find(pl => pl.id === playerId);
                if (!p) return null;
                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded px-3 py-2 ${
                      p.id === player?.id ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <span className="font-semibold">{p.name}</span>
                    {p.id === player?.id && (
                      <span className="text-xs text-red-600 ml-2">(You)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team B */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h3 className="font-bold text-blue-700 mb-3 text-lg">Team B</h3>
            <div className="space-y-2">
              {teams.B?.map((playerId) => {
                const p = players.find(pl => pl.id === playerId);
                if (!p) return null;
                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded px-3 py-2 ${
                      p.id === player?.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <span className="font-semibold">{p.name}</span>
                    {p.id === player?.id && (
                      <span className="text-xs text-blue-600 ml-2">(You)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Player Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Players: <span className="font-bold">{players.length}</span> / 4 minimum
          </p>
          {!canStart && (
            <p className="text-sm text-red-600 mt-2">
              Need at least 4 players to start
            </p>
          )}
        </div>

        {/* Start Button */}
        {isCreator && (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Start Game
          </button>
        )}

        {!isCreator && (
          <div className="text-center text-gray-600 py-4">
            Waiting for game creator to start...
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
