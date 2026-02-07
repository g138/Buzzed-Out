# Analytics Setup Guide - Track Your App Traffic

This guide will help you set up Google Analytics to track traffic and user behavior on your Buzzed Out game.

## 📊 What You'll Track

- **Page Views**: Landing page, Lobby, Game
- **Game Events**: 
  - Games created
  - Games joined
  - Games started
  - Rounds started
  - Cards passed
  - Timer ended
  - Games finished
- **User Engagement**: Time spent, user flow
- **Traffic Sources**: Where users come from
- **Device Information**: Desktop vs Mobile usage

## 🚀 Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Admin"** (gear icon)
4. Click **"Create Account"**
5. Fill in:
   - Account name: "Buzzed Out Game" (or your choice)
   - Account data sharing settings (choose your preferences)
   - Click **"Next"**

## 🎯 Step 2: Create a Property

1. Property name: "Buzzed Out - Pass the Card"
2. Reporting time zone: Choose your timezone
3. Currency: Choose your currency
4. Click **"Next"**
5. Business information (optional):
   - Industry category: "Games"
   - Business size: Choose appropriate
   - How you intend to use GA4: Select relevant options
6. Click **"Create"**
7. Accept the Terms of Service

## 🔑 Step 3: Get Your Measurement ID

1. After creating the property, you'll see a **Data Streams** section
2. Click **"Add stream"** → **"Web"**
3. Enter:
   - Website URL: Your domain (e.g., `https://your-domain.com`)
   - Stream name: "Buzzed Out Web"
4. Click **"Create stream"**
5. You'll see your **Measurement ID** (format: `G-XXXXXXXXXX`)
6. **Copy this ID** - you'll need it in the next step

## ⚙️ Step 4: Add Measurement ID to Your App

### Option A: Update index.html directly

1. Open `frontend/public/index.html`
2. Find this line:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID (twice in the file)
4. Save the file

### Option B: Use Environment Variable (Recommended)

1. Create a `.env` file in the `frontend` directory:
   ```bash
   cd frontend
   touch .env
   ```

2. Add your Measurement ID:
   ```
   REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   (Replace `G-XXXXXXXXXX` with your actual ID)

3. Update `frontend/public/index.html` to use the environment variable:
   ```html
   <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_MEASUREMENT_ID}`}></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
       page_path: window.location.pathname,
     });
   </script>
   ```

   **Note**: For React apps, you'll need to use a different approach since `index.html` doesn't support environment variables directly. Instead, update the script in `index.html` manually or use the React approach below.

### Option C: React-based Setup (Best for React Apps)

1. Install react-ga4 (optional, but recommended):
   ```bash
   cd frontend
   npm install react-ga4
   ```

2. Or simply update `index.html` with your Measurement ID directly (simplest approach)

## ✅ Step 5: Verify It's Working

1. **Build and deploy** your app (or run locally)
2. Visit your app in a browser
3. Perform some actions (create game, join game, etc.)
4. Go to Google Analytics
5. Click **"Reports"** → **"Realtime"**
6. You should see your activity within a few seconds!

## 📈 Step 6: View Your Traffic Data

### Real-time Data
- Go to **Reports** → **Realtime**
- See active users right now
- View events as they happen

### Standard Reports
- **Overview**: General traffic stats
- **User Acquisition**: Where users come from
- **Engagement**: How users interact
- **Events**: Custom events (game_created, game_joined, etc.)
- **Demographics**: User location, device, browser

### Custom Reports
1. Go to **Explore** → **Create new exploration**
2. Create custom reports for:
   - Games created per day
   - Average players per game
   - Most active times
   - User retention

## 🎯 Key Metrics to Monitor

### Traffic Metrics
- **Users**: Total unique visitors
- **Sessions**: Total visits
- **Page views**: Total pages viewed
- **Bounce rate**: Single-page sessions

### Game-Specific Metrics
- **Games created**: How many games are started
- **Games joined**: How many players join
- **Games finished**: Completion rate
- **Average game duration**: How long games last
- **Card passes**: Gameplay activity

### User Behavior
- **User flow**: Landing → Lobby → Game
- **Drop-off points**: Where users leave
- **Returning users**: User retention

## 🔍 Viewing Specific Events

1. Go to **Reports** → **Engagement** → **Events**
2. You'll see all tracked events:
   - `game_created`
   - `game_joined`
   - `game_started`
   - `round_started`
   - `card_passed`
   - `timer_ended`
   - `game_finished`

3. Click on any event to see details:
   - Event count
   - Parameters (game_code, player_count, etc.)
   - User information

## 📱 Mobile App Tracking (Future)

If you create a mobile app later, you can:
1. Add a new data stream for iOS/Android
2. Use Firebase Analytics (integrated with GA4)
3. Track the same events across platforms

## 🛠️ Advanced: Custom Dimensions

Track additional data by adding custom dimensions:
1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Create dimensions for:
   - Game code
   - Player count
   - Team
   - Round number

## 🚨 Troubleshooting

### No data showing?
- ✅ Check Measurement ID is correct
- ✅ Verify the script is loading (check browser console)
- ✅ Make sure you're not using an ad blocker
- ✅ Wait 24-48 hours for standard reports (real-time should work immediately)

### Events not tracking?
- ✅ Check browser console for errors
- ✅ Verify analytics.js is imported correctly
- ✅ Make sure events are being called in App.js

### Test in Real-time View
- Use **Realtime** reports to verify events are firing
- Test events immediately after implementation

## 📊 Alternative Analytics Options

If you prefer alternatives to Google Analytics:

### 1. **Plausible Analytics** (Privacy-focused)
- Simple, privacy-friendly
- No cookies, GDPR compliant
- Paid service

### 2. **Mixpanel** (Event-focused)
- Great for tracking user actions
- Free tier available
- More detailed event tracking

### 3. **Amplitude** (Product analytics)
- User behavior tracking
- Free tier available
- Good for games

### 4. **Simple Server Logs**
- Track basic page views
- No external service needed
- Less detailed

## 🎉 You're All Set!

Once set up, you'll be able to:
- ✅ See how many people visit your game
- ✅ Track game events and user behavior
- ✅ Understand where traffic comes from
- ✅ Make data-driven improvements

Check your analytics dashboard regularly to understand your users and improve the game experience!

## 📚 Additional Resources

- [Google Analytics Help Center](https://support.google.com/analytics)
- [GA4 Events Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Custom Events Guide](https://support.google.com/analytics/answer/9267735)
