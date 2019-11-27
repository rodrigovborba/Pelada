//google sign in settings
const {
    Router
  } = require('express');
const router = new Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./../models/user');

//signing in with the google account
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },

  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      googleId: profile.id
    }, function (err, user) {
      return done(err, user);
    });
  }
));

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })),

router.get('/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'
 }),

  function(req, res){
    res.redirect('/');
  });

  // function onSignIn(googleUser) {
  //   let profile = googleUser.getBasicProfile();
  //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //   console.log('Name: ' + profile.getName());
  //   console.log('Image URL: ' + profile.getImageUrl());
  //   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  // }