const {
    Router
} = require('express');
const router = new Router();
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            res.render('profile', {
                user
            });
        })
        .catch(error => {
            next(error);
        });
});

router.post('/edit/:id', (req, res, next) => {
    const id = req.params.id;
    const {
        firstname,
        surname,
        birthdate,
        position
    } = req.body;
            User.findByIdAndUpdate(id, {
                firstname,
                surname,
                birthdate,
                position
            })
            .then(user => {
                res.redirect('/profile/' + user._id);
            })
            .catch(error => {
                next(error);
            });
        });

module.exports = router;