// Google Analytics utility functions
// Measurement ID: G-R5EEQB9PJ8

/**
 * Initialize Google Analytics
 * This is called automatically by the script in index.html
 */
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('Google Analytics initialized');
  }
};

/**
 * Track page views
 * @param {string} pagePath - The path of the page
 * @param {string} pageTitle - The title of the page
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-R5EEQB9PJ8', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track game created
 * @param {string} gameCode - The game code
 */
export const trackGameCreated = (gameCode) => {
  trackEvent('game_created', {
    game_code: gameCode,
    event_category: 'Game',
    event_label: 'Game Created',
  });
};

/**
 * Track game joined
 * @param {string} gameCode - The game code
 */
export const trackGameJoined = (gameCode) => {
  trackEvent('game_joined', {
    game_code: gameCode,
    event_category: 'Game',
    event_label: 'Game Joined',
  });
};

/**
 * Track game started
 * @param {string} gameCode - The game code
 * @param {number} playerCount - Number of players
 */
export const trackGameStarted = (gameCode, playerCount) => {
  trackEvent('game_started', {
    game_code: gameCode,
    player_count: playerCount,
    event_category: 'Game',
    event_label: 'Game Started',
  });
};

/**
 * Track round started
 * @param {string} gameCode - The game code
 * @param {number} roundNumber - Round number
 */
export const trackRoundStarted = (gameCode, roundNumber) => {
  trackEvent('round_started', {
    game_code: gameCode,
    round_number: roundNumber,
    event_category: 'Game',
    event_label: 'Round Started',
  });
};

/**
 * Track card passed
 * @param {string} gameCode - The game code
 * @param {string} fromTeam - Team that passed the card
 * @param {string} toTeam - Team that received the card
 */
export const trackCardPassed = (gameCode, fromTeam, toTeam) => {
  trackEvent('card_passed', {
    game_code: gameCode,
    from_team: fromTeam,
    to_team: toTeam,
    event_category: 'Game',
    event_label: 'Card Passed',
  });
};

/**
 * Track game finished
 * @param {string} gameCode - The game code
 * @param {string} winner - Winning team
 * @param {number} finalScoreA - Final score for team A
 * @param {number} finalScoreB - Final score for team B
 */
export const trackGameFinished = (gameCode, winner, finalScoreA, finalScoreB) => {
  trackEvent('game_finished', {
    game_code: gameCode,
    winner: winner,
    final_score_a: finalScoreA,
    final_score_b: finalScoreB,
    event_category: 'Game',
    event_label: 'Game Finished',
  });
};

/**
 * Track timer ended
 * @param {string} gameCode - The game code
 * @param {string} losingTeam - Team that lost
 */
export const trackTimerEnded = (gameCode, losingTeam) => {
  trackEvent('timer_ended', {
    game_code: gameCode,
    losing_team: losingTeam,
    event_category: 'Game',
    event_label: 'Timer Ended',
  });
};

/**
 * Track user engagement time
 * @param {number} seconds - Time spent in seconds
 */
export const trackEngagementTime = (seconds) => {
  trackEvent('user_engagement', {
    engagement_time_msec: seconds * 1000,
    event_category: 'Engagement',
  });
};
