const {
    Router
} = require('express');
const router = new Router();
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const uploadCloud = require('../middleware/cloudinary');
const routeGuard = require('./../middleware/guard')

router.get('/:id', routeGuard, (req, res, next) => {
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

router.post('/edit/:id', routeGuard, (req, res, next) => {
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

        router.get('/uploadPhoto/:id', (req, res, next) => {
            res.render('uploadProfilePhoto');
          });

        router.post('/photoUpload/:id', uploadCloud.single('photo'), (req, res, next) => {
            const id = req.params.id;
            console.log(req.file);
            
            User.findByIdAndUpdate(id,{
                photo: req.file.url
            })
            .then(user => {
                res.redirect('/profile/' + user._id);
            })
            .catch(error => {
                next(error);
            });
        });
module.exports = router;