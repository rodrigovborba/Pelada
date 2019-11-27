const { Router } = require('express');
const router = new Router();
const Game = require('./../models/creatinggame');

router.get('/', (req, res, next) => {
    const userId = req.session.user;
   // console.log(userId);
    Game.find(
        {author: userId}
        )
    .populate("author")
      .then(game => {
          //console.log(game);
        res.render('mygames', {
          game
        });
      })
      .catch(error => {
        next(error);
      });
  });


module.exports = router;