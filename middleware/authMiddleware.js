const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      let existingUser = await User.findOne({ email: profile.email });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = await User.create({
        name: profile.displayName,
        email: profile.email,
        password: await bcrypt.hash(profile.id, 12),
        role: 'student', 
      });

      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); 
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
