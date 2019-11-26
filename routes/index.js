const {
  Router
} = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const routeGuard = require('./../middleware/guard');
const Game = require('./../models/creatinggame');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/authentication', (req, res, next) => {
  res.render('authentication');
});



router.post('/authentication', (req, res, next) => {

  const {
    firstname,
    surname,
    email,
    username,
    password
  } = req.body;
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        firstname,
        surname,
        email,
        username,
        passwordHash: hash
      });
    })
    .then(user => {
      //console.log('user created', user);
      req.session.user = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let userId;
  const {
    username,
    password
  } = req.body;
  //console.log(username);
  User.findOne({
      username
    })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('This user cant be found.'));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect('games');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });
});



router.get('/games', (req, res, next) => {
  res.render('games');
});

router.get('/creategame', (req, res, next) => {
  res.render('creategame');
});

router.post('/creategame', (req, res, next) => {
  const {
    groupName,
    location,
    numberOfPlayers,
    dayOfPlay,
    time
  } = req.body;
  Game.create({
      groupName,
      location,
      numberOfPlayers,
      dayOfPlay,
      time
    })
    .then(game => {
      console.log('user created', game);
      // req.session.user = game._id;
      res.redirect('/gamespage');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/listgames', (req, res, next) => {
  const gameId = req.params.gameId;
  Game.findById(gameId)
    .then(game => {
      console.log(game);
      res.render('gamespage', { game });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});


router.post('/signout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;