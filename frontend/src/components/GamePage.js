import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import TimerIndicator from './TimerIndicator';
import DescribingPlayerView from './DescribingPlayerView';
import GuessingPlayerView from './GuessingPlayerView';
import OpposingTeamView from './OpposingTeamView';
import BuzzerAlert from './BuzzerAlert';

const GamePage = ({ gameCode, player, gameState, socket, onNextRound }) => {
  const [localGameState, setLocalGameState] = useState(gameState);
  const [guessedPhrases, setGuessedPhrases] = useState([]);
  const [showBuzzer, setShowBuzzer] = useState(false);
  const [cardPassAnimation, setCardPassAnimation] = useState(false);

  useEffect(() => {
    setLocalGameState(gameState);
    if (gameState?.currentCard) {
      // Initialize guessed phrases from game state
      setGuessedPhrases(gameState.guessedPhrases || []);
    } else {
      // Reset when new round starts
      setGuessedPhrases([]);
    }
  }, [gameState]);

  useEffect(() => {
    if (!socket) return;

    const handleCardPassed = ({ cardHolder, card, phraseIndex, scores, guessedPhrases: gp }) => {
      setCardPassAnimation(true);
      setTimeout(() => setCardPassAnimation(false), 500);
      setLocalGameState(prev => ({
        ...prev,
        cardHolder,
        currentCard: card,
        scores,
        guessedPhrases: gp
      }));
      setGuessedPhrases(gp || []);
    };

    const handleAllPhrasesGuessed = ({ card, scores, guessedPhrases: gp }) => {
      setLocalGameState(prev => ({
        ...prev,
        currentCard: card,
        scores,
        guessedPhrases: gp
      }));
      setGuessedPhrases(gp || []);
    };

    const handleTimerEnded = ({ losingTeam, winningTeam, cardHolder }) => {
      setShowBuzzer(true);
      setLocalGameState(prev => ({
        ...prev,
        timerEnded: true,
        losingTeam,
        winningTeam,
        cardHolder
      }));
    };

    const handleRoundStarted = (state) => {
      setLocalGameState(prev => ({
        ...prev,
        ...state
      }));
      setGuessedPhrases(state.guessedPhrases || []);
      setShowBuzzer(false);
    };

    socket.on('cardPassed', handleCardPassed);
    socket.on('allPhrasesGuessed', handleAllPhrasesGuessed);
    socket.on('timerEnded', handleTimerEnded);
    socket.on('roundStarted', handleRoundStarted);

    return () => {
      socket.off('cardPassed', handleCardPassed);
      socket.off('allPhrasesGuessed', handleAllPhrasesGuessed);
      socket.off('timerEnded', handleTimerEnded);
      socket.off('roundStarted', handleRoundStarted);
    };
  }, [socket]);

  if (!localGameState || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  const isDescribingPlayer = localGameState.describingPlayers?.includes(player.id);
  const isGuessingPlayer = !isDescribingPlayer && player.team === localGameState.cardHolder;
  const isOpposingTeam = !isDescribingPlayer && player.team !== localGameState.cardHolder;

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 fade-in">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 flex justify-between items-center flex-wrap gap-4 hover:shadow-xl transition-shadow duration-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Round {localGameState.round || 1}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Game Code: <span className="font-bold text-purple-600">{gameCode}</span></p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              player.team === 'A' 
                ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            }`}>
              Team {player.team}
            </div>
            <p className="font-semibold text-gray-800 mt-2">{player.name}</p>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="max-w-6xl mx-auto mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
        <Scoreboard
          scores={localGameState.scores}
          cardHolder={localGameState.cardHolder}
        />
      </div>

      {/* Timer Indicator */}
      <div className="max-w-6xl mx-auto mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
        <TimerIndicator
          timerStarted={localGameState.timerStarted}
          timerEnded={localGameState.timerEnded}
        />
      </div>

      {/* Buzzer Alert */}
      {showBuzzer && (
        <BuzzerAlert
          losingTeam={localGameState.losingTeam}
          winningTeam={localGameState.winningTeam}
          onClose={() => setShowBuzzer(false)}
          onNextRound={onNextRound}
        />
      )}

      {/* Role-specific Views */}
      <div className="max-w-6xl mx-auto fade-in" style={{ animationDelay: '0.3s' }}>
        {isDescribingPlayer && (
          <DescribingPlayerView
            card={localGameState.currentCard}
            guessedPhrases={guessedPhrases}
            gameCode={gameCode}
            socket={socket}
            cardPassAnimation={cardPassAnimation}
            cardHolder={localGameState.cardHolder}
            player={player}
          />
        )}

        {isGuessingPlayer && (
          <GuessingPlayerView
            gameCode={gameCode}
            socket={socket}
            player={player}
            cardHolder={localGameState.cardHolder}
            card={localGameState.currentCard}
            guessedPhrases={guessedPhrases}
          />
        )}

        {isOpposingTeam && (
          <OpposingTeamView
            cardHolder={localGameState.cardHolder}
            scores={localGameState.scores}
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;
