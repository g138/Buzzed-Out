import React from 'react';

const TimerIndicator = ({ timerStarted, timerEnded }) => {
  if (!timerStarted) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          timerEnded ? 'bg-red-500' : 'bg-green-500 animate-pulse'
        }`}></div>
        <p className="text-sm font-semibold text-gray-700">
          {timerEnded ? 'Timer Ended!' : 'Timer Running...'}
        </p>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        {timerEnded 
          ? 'The buzzer has sounded!' 
          : 'Hidden timer is running. When it ends, the team holding the card loses.'}
      </p>
    </div>
  );
};

export default TimerIndicator;
