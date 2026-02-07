# Buzzed Out - Pass the Card | Free Online Multiplayer Party Game

**Buzzed Out** (also known as **Pass the Card**) is a free online multiplayer party game where two teams compete by passing a card back and forth by correctly guessing phrases. The team holding the card when the hidden timer ends loses! Play instantly in your browser - no download required.

**Keywords**: Buzzed Out, Pass the Card, online party game, multiplayer word game, free online game, team guessing game, real-time multiplayer, card game online, buzzed out game

## Game Rules

- **Two Teams**: Team A and Team B
- **Each Round**:
  - One player from each team is the "Describing Player"
  - Remaining players are "Guessing Players"
- **Card Passing**: Teams pass the card by correctly guessing phrases
- **Hidden Timer**: A random timer (60-120 seconds) runs in the background
- **Winning Conditions**:
  - If the timer ends: The team holding the card loses, the other team gets a point
  - If all 10 phrases are guessed: Both teams get a point
- **Role Rotation**: Roles rotate each round

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebSockets via Socket.IO

## Project Structure

```
pass-the-card-game/
├── backend/
│   ├── server.js          # Express server with Socket.IO
│   ├── gameManager.js     # Game logic and state management
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Socket.IO context
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # TailwindCSS styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:3001` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` by default and automatically open in your browser.

**Note**: Make sure the backend server is running before starting the frontend.

## How to Play

1. **Create or Join a Game**:
   - Open the app in your browser
   - Enter your name
   - Create a new game or join with a game code

2. **Lobby**:
   - Share the game code with other players
   - Wait for at least 4 players to join
   - The game creator can start the game

3. **During the Game**:
   - **Describing Players**: See the card with phrases. Describe them to your team and click phrases when guessed correctly.
   - **Guessing Players**: Submit your guesses via text input. The describing player will mark correct guesses.
   - **Opposing Team**: Wait and watch. The card will pass to you when the other team guesses correctly.

4. **Scoring**:
   - Timer ends → Team holding card loses, other team gets a point
   - All phrases guessed → Both teams get a point

5. **Next Round**:
   - After the buzzer, click "Next Round" to continue
   - Roles rotate automatically

## Features

- ✅ Real-time multiplayer gameplay
- ✅ Role-based views (Describing Player, Guessing Players, Opposing Team)
- ✅ Hidden timer with buzzer alert
- ✅ Card passing animations
- ✅ Live scoreboard
- ✅ Team assignment and management
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time guess submissions
- ✅ Game state synchronization

## WebSocket Events

### Client → Server

- `createGame` - Create a new game session
- `joinGame` - Join an existing game
- `startGame` - Start the game (creator only)
- `markCorrect` - Mark a phrase as correctly guessed (describing player only)
- `submitGuess` - Submit a guess (guessing players)
- `nextRound` - Start the next round

### Server → Client

- `gameCreated` - Game created successfully
- `gameJoined` - Successfully joined a game
- `playerJoined` - A new player joined the game
- `gameStarted` - Game has started
- `roundStarted` - A new round has started
- `cardPassed` - Card passed to the other team
- `allPhrasesGuessed` - All phrases on the card were guessed
- `timerEnded` - The hidden timer ended
- `guessReceived` - A guess was received (for describing players)
- `guessSubmitted` - A guess was submitted (broadcast to all)
- `error` - An error occurred

## Development

### Environment Variables

You can set the backend server URL in the frontend by creating a `.env` file:

```
REACT_APP_SERVER_URL=http://localhost:3001
```

### Testing

To test the game:
1. Open multiple browser tabs/windows
2. Create a game in one tab
3. Join with the game code in other tabs
4. Use different names for each player
5. Start the game and play!

## Future Enhancements

- Voice chat integration
- More card categories
- Custom card creation
- Player statistics
- Game history
- Mobile app version
- Spectator mode

## License

ISC

## Author

Built with ❤️ for multiplayer party fun!
