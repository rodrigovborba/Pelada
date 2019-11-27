const {
    Router
} = require('express');
const router = new Router();
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const uploadCloud = require('../middleware/cloudinary');
const Photo = require('../models/photo.js');

router.get('/:id', uploadCloud.single('photo'), (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            res.render('profile', {
                user
            });
        })
        .then(photo => {
            Photo.create({
                photo: req.file.url
            });
            console.log(photo);
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