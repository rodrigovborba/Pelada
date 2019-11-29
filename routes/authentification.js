const {
  Router
} = require('express');
const router = new Router();

const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
//const transporter = require('./../send');

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



router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const {
    name,
    email,
    password,
    status
  } = req.body;
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        status,
        confirmationCode: token
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
          user.status === 'Active'
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

router.get("/auth/confirm/:code", (req, res) => {
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
          res.render('sign-in', result[0]);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});




module.exports = router;