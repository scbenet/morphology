require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');
const session = require('express-session');

const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

// Logging setup
// Log errors 
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
})
// Log requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
})

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/google',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        // Check if user exists
        const userResult = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [id]
        );

        let user;
        if (userResult.rows.length === 0) {
          // Create new user
          const newUserResult = await pool.query(
            'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *',
            [id, email, displayName]
          );
          user = newUserResult.rows[0];
          // Create default stats for the new user
          await pool.query(
            'INSERT INTO stats (user_id, games_played, current_streak, longest_streak) VALUES ($1, 0, 0, 0)',
            [user.id]
          );
        } else {
          user = userResult.rows[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    done(null, userResult.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the game backend!');
});

// Google OAuth routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173');
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.redirect('http://localhost:5173');
  });
});

// Get user data
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.json(req.user);
  }
  else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Fetch user stats
app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const statsResult = await pool.query(
        'SELECT * FROM stats WHERE user_id = $1',
        [req.user.id]
      );
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.set('Access-Control-Allow-Credentials', 'true');
      res.json(statsResult.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/game-complete', isAuthenticated, async (req, res) => {
    try {
        // Get current stats for user
        const statsResult = await pool.query(
            'SELECT * FROM stats WHERE user_id = $1',
            [req.user.id]
        );
        const stats = statsResult.rows[0]
        console.log(stats)

        // Calculate time difference since last game
        const now = new Date();
        const lastPlayed = new Date(stats.last_played);
        const timeDiff = now - lastPlayed;
        const oneDay = 36 * 60 * 60 * 1000 // Count 36 hours as one day for a little wiggle room
        console.log(timeDiff)
        // Update current streak
        let currentStreak = stats.current_streak;
        if (timeDiff <= oneDay) {
            currentStreak += 1
        } else {
            currentStreak = 1;
        }

        // Update longest streak if neccessary
        const longestStreak = Math.max(stats.longest_streak, currentStreak);

        // Update results in db
        const updateResult = await pool.query(
            'UPDATE stats SET games_played = games_played + 1, current_streak = $1, longest_streak = $2, last_played = NOW() WHERE user_id = $3 RETURNING *',
            [currentStreak, longestStreak, req.user.id]
        );
        console.log(updateResult.rows[0])
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.set('Access-Control-Allow-Credentials', 'true');
        res.json(updateResult.rows[0]);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Internal server error'})
    }
})
  

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
