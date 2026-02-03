import React from 'react';

const TimerIndicator = ({ timerStarted, timerEnded }) => {
  if (!timerStarted) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-center mb-3">
        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full mr-3 shadow-lg transition-all duration-300 ${
          timerEnded ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'
        }`}></div>
        <p className={`text-base md:text-lg font-bold ${
          timerEnded ? 'text-red-600' : 'text-green-600'
        }`}>
          {timerEnded ? '⏰ Timer Ended!' : '⏱️ Timer Running...'}
        </p>
      </div>
      <p className={`text-xs md:text-sm text-center font-medium ${
        timerEnded ? 'text-red-600' : 'text-gray-600'
      }`}>
        {timerEnded 
          ? 'The buzzer has sounded!' 
          : 'Hidden timer is running. When it ends, the team holding the card loses.'}
      </p>
    </div>
  );
};

export default TimerIndicator;
