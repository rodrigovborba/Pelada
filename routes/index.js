const {
  Router
} = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const routeGuard = require('./../middleware/guard');
const Game = require('./../models/creatinggame');
const Field = require('./../models/field');
// const clientID = process.env.GOOGLE_CLIENTE_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

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



//route for the welcome page
router.get('/', (req, res, next) => {
  res.render('index');
});

//route for the sign up and sign in page
router.get('/authentication', (req, res, next) => {
  res.render('authentication');
});


// routes for the sign up logic merge with the email confirmation send to user after click event on sign up button
router.post('/authentication', (req, res, next) => {


  const {
    firstname,
    surname,
    email,
    username,
    password,
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
      res.redirect('profile/' + user._id);
    })
    .catch(error => {
      next(error);
    });
});

//routes for the email confirmation for updating the user status after confirming their email
router.get('/auth/confirm', (req, res) => {
  const {
    code
  } = req.params;
  User.find({
      confirmationCode: {
        $eq: code
      }
    })
    .then(result => {
      User.update({
          _id: result[0]._id
        }, {
          status: 'Active'
        })
        .then(() => {
          res.render('auth/confirm', result[0]);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});


//routes for the login logic
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let userId;
  const {
    username,
    password
  } = req.body;
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


// Get all games
router.get('/games', routeGuard, (req, res, next) => {
  Game.find()
    .then(game => {
      res.render('games', {
        game
      });
      //console.log(game);
    })
    .catch(error => {
      next(error);
    });
});

// Create Game - Get all fields
router.get('/creategame', routeGuard, (req, res, next) => {
  Field.find({})
    .then(fields => {
      res.render('creategame', {
        fields
      });
    });

});

// Create Game
router.post('/creategame', routeGuard, (req, res, next) => {
  const author = req.session.user;
  const id = req.params.id;
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
      author,
      numberOfPlayers,
      dayOfPlay,
      time
    })
    .then(game => {
      res.redirect('/singlegame/' + game._id);
    })
    .catch(error => {
      next(error);
    });
});

// Join Game
router.post('/joingame/:id', (req, res, next) => {
  const gamesid = req.params.id;
  const playerid = req.session.user;
  Game.findByIdAndUpdate(gamesid, {
      $push: {
        players: playerid
      }
    })
    .then(game => {
      console.log(playerid);
      res.redirect('/singlegame/' + game._id);
    })
    .catch(error => {
      next(error);
    });
});

// Rendering single page
//const {ObjectId} = require('mongodb'); // or ObjectID 

router.get('/singlegame/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userid = req.session.user;
  let helper = false;
  let attending = false;
  Game.findById(id)
    .populate("location players")
    .then(game => {
      const attendingPlayer = game.players.filter(item => item._id == userid)[0];
      if (attendingPlayer) {
        attending = true;
      } else {
        attending = false;
      }
      console.log("AUTHOR", game.author, "USER ID", req.session.user);
      if (game.author == req.session.user) {
        console.log("NOTICE ME");
        helper = true;
      }
      res.render('singlegame', {
        game,
        helper,
        attending
      });
    })
    .catch(error => {
      next(error);
    });
});

// Leaving game from single game
router.post('/user/:id/delete', (req, res, next) => {
  const gamesid = req.params.id;
  const playerid = req.session.user;
  Game.findByIdAndUpdate(gamesid, {
      $pull: {
        players: playerid
      }
    })
    .then(game => {
      console.log("GAMES DELETE ROUTE");
      console.log("GAMES", gamesid);
      console.log("PLAYERS", playerid);
      res.redirect('/singlegame/' + gamesid);
    })
    .catch(error => {
      next(error);
    });
});

// Leaving game from my games
router.post('/user/:id/delete1', (req, res, next) => {
  const gamesid = req.params.id;
  const playerid = req.session.user;
  Game.findByIdAndUpdate(gamesid, {
      $pull: {
        players: playerid
      }
    })
    .then(game => {
      console.log("GAMES DELETE ROUTE");
      console.log("GAMES", gamesid);
      console.log("PLAYERS", playerid);
      res.redirect('/mygames');
    })
    .catch(error => {
      next(error);
    });
});

router.post('/edit/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const {
    groupName,
    numberOfPlayers,
    dayOfPlay,
    time
  } = req.body;
  Game.findByIdAndUpdate(id, {
      groupName,
      numberOfPlayers,
      dayOfPlay,
      time
    })
    .then(game => {
      console.log(game);

      res.redirect('/singlegame/' + game._id);
    })
    .catch(error => {
      next(error);
    });
});
// Delete Game From My Games
router.post('/deletegame/:id', routeGuard, (req, res, next) => {
  const gameId = req.params.id;
  Game.findByIdAndRemove(gameId)
    .then(user => {
      res.redirect("/mygames");
    })
    .catch(error => {
      next(error);
    });
});

// Delete Game From Single Game
// Fix this Saturday
router.post('/deletegame1/:id', routeGuard, (req, res, next) => {
  const gameId = req.params.id;
  Game.findByIdAndRemove(gameId)
    .then(user => {
      res.redirect("/games");
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

router.get('/fields/index', routeGuard, (req, res, next) => {
  Field.find({}).then(fields => {
    res.render('fields/index', {
      fields
    });
  });
});

module.exports = router;


//https://console.developers.google.com/apis/credentials/oauthclient/750193338798-pgjqff1kf3gllts6c4g3t9g9uk2rtjp6.apps.googleusercontent.com?project=pelada-1574796387099&authuser=0