const {
  Router
} = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const routeGuard = require('./../middleware/guard');
const Game = require('./../models/creatinggame');


const generateId = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
};

const token = generateId(15);


const nodemailer = require('nodemailer');
const EMAIL = 'ih174test@gmail.com';
const PASSWORD = 'IH174@lis';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});


//google sign in settings
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//signing in with the google account
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENTE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
     User.findOrCreate({ googleId: profile.id }, function (err, user) {
       return done(err, user);
     });
}
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/authentication' }),
  function(req, res) {
    res.redirect('/');
  });



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
      req.session.user = user._id;
      transporter.sendMail({
          from: `MENDES MENDES <${EMAIL}>`,
          to: email,
          subject: 'MENDES MENDES MENDES',
          html: `<p>This is a test content </p>
        <a href='http://localhost:3000/auth/confirm/${token}'>Click here to confirm your email </a>`
        })
        .then(response => {
          user.status === 'Active';
        })
        .catch(error => {
          console.log(error)
        })
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get("/auth/confirm.hbs/:code", (req, res) => {
  const {code} = req.params;
  User.find({confirmationCode:{$eq: code}})
  .then(result => {
    User.update({_id: result[0]._id}, {status: 'Active'})
    .then(() => {
      res.render('authentication', result[0]);
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
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

  // const gameId = req.params.gameId;
  // console.log(gameId);
  Game.find()
    .then(game => {
      res.render('games', {
        game
      });
      console.log(game);
    })
    .catch(error => {
      next(error);
    });
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
      res.redirect('/games');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/singlegame', (req, res, next) => {
  res.render('singlegame');
});


router.get('/signup', (req, res, next) => {
  res.render('signup');
});


router.post('/signout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;


// clientid 750193338798-kij85gnubqg38sjbieb57tvglfeajp85.apps.googleusercontent.com

// client secret IC5KRgFJa1tbwTlmMH8sGWLA