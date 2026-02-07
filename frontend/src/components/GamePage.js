import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import TimerIndicator from './TimerIndicator';
import DescribingPlayerView from './DescribingPlayerView';
import GuessingPlayerView from './GuessingPlayerView';
import OpposingTeamView from './OpposingTeamView';
import BuzzerAlert from './BuzzerAlert';
import WinnerScreen from './WinnerScreen';

const GamePage = ({ gameCode, player, gameState, socket, onNextRound, onNewGame }) => {
  const [localGameState, setLocalGameState] = useState(gameState);
  const [guessedPhrases, setGuessedPhrases] = useState([]);
  const [showBuzzer, setShowBuzzer] = useState(false);
  const [cardPassAnimation, setCardPassAnimation] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerData, setWinnerData] = useState(null);

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

    const handleCardPassed = ({ cardHolder, card, phraseIndex, scores, guessedPhrasesBlue, guessedPhrasesOrange }) => {
      setCardPassAnimation(true);
      setTimeout(() => setCardPassAnimation(false), 500);
      setLocalGameState(prev => ({
        ...prev,
        cardHolder,
        currentCard: card,
        scores,
        guessedPhrasesBlue: guessedPhrasesBlue || [],
        guessedPhrasesOrange: guessedPhrasesOrange || []
      }));
    };

    const handleAllPhrasesGuessed = ({ card, scores, guessedPhrasesBlue, guessedPhrasesOrange }) => {
      setLocalGameState(prev => ({
        ...prev,
        currentCard: card,
        scores,
        guessedPhrasesBlue: guessedPhrasesBlue || [],
        guessedPhrasesOrange: guessedPhrasesOrange || []
      }));
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
      setShowBuzzer(false);
    };

    const handleGameFinished = ({ winner, scores, round }) => {
      setWinnerData({ winner, scores, round });
      setShowWinner(true);
      setShowBuzzer(false);
    };

    socket.on('cardPassed', handleCardPassed);
    socket.on('allPhrasesGuessed', handleAllPhrasesGuessed);
    socket.on('timerEnded', handleTimerEnded);
    socket.on('roundStarted', handleRoundStarted);
    socket.on('gameFinished', handleGameFinished);

    return () => {
      socket.off('cardPassed', handleCardPassed);
      socket.off('allPhrasesGuessed', handleAllPhrasesGuessed);
      socket.off('timerEnded', handleTimerEnded);
      socket.off('roundStarted', handleRoundStarted);
      socket.off('gameFinished', handleGameFinished);
    };
  }, [socket]);

  if (!localGameState || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  const isDescribingPlayer = player && localGameState.describingPlayers?.includes(player.id);
  const isDescribingPlayerWithCard = isDescribingPlayer && player?.team === localGameState.cardHolder;
  const isDescribingPlayerWithoutCard = isDescribingPlayer && player?.team !== localGameState.cardHolder;
  const isGuessingPlayer = !isDescribingPlayer && player?.team === localGameState.cardHolder;
  const isOpposingTeam = !isDescribingPlayer && player?.team !== localGameState.cardHolder;

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 fade-in">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 flex justify-between items-center flex-wrap gap-4 hover:shadow-xl transition-shadow duration-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Round {localGameState.round || 1} / 8
            </h1>
            <p className="text-gray-600 text-sm mt-1">Game Code: <span className="font-bold text-purple-600">{gameCode}</span></p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              player?.team === 'A' 
                ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            }`}>
              Team {player?.team || '?'}
            </div>
            <p className="font-semibold text-gray-800 mt-2">{player?.name || 'Unknown'}</p>
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
          currentRound={localGameState.round || 1}
          maxRounds={8}
        />
      )}

      {/* Winner Screen */}
      {showWinner && winnerData && (
        <WinnerScreen
          winner={winnerData.winner}
          scores={winnerData.scores}
          onNewGame={onNewGame}
        />
      )}

      {/* Role-specific Views */}
      <div className="max-w-6xl mx-auto fade-in" style={{ animationDelay: '0.3s' }}>
        {/* Describing Player WITH Card - Can see the card */}
        {isDescribingPlayerWithCard && (
          <DescribingPlayerView
            card={localGameState.currentCard}
            guessedPhrasesBlue={localGameState.guessedPhrasesBlue || []}
            guessedPhrasesOrange={localGameState.guessedPhrasesOrange || []}
            gameCode={gameCode}
            socket={socket}
            cardPassAnimation={cardPassAnimation}
            cardHolder={localGameState.cardHolder}
            player={player}
          />
        )}

        {/* Describing Player WITHOUT Card - Cannot see the card */}
        {isDescribingPlayerWithoutCard && (
          <OpposingTeamView
            cardHolder={localGameState.cardHolder}
            scores={localGameState.scores}
            isDescribingPlayer={true}
            player={player}
          />
        )}

        {isGuessingPlayer && (
          <GuessingPlayerView
            gameCode={gameCode}
            socket={socket}
            player={player}
            cardHolder={localGameState.cardHolder}
          />
        )}

        {isOpposingTeam && (
          <OpposingTeamView
            cardHolder={localGameState.cardHolder}
            scores={localGameState.scores}
            isDescribingPlayer={false}
            player={player}
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;
