// const {
//   Router
// } = require('express');
// const router = new Router();
// const Game = require('./../models/creatinggame');
// const routeGuard = require('./../middleware/guard');




// module.exports = router;

const {
  Router
} = require('express');
const router = new Router();
const Game = require('./../models/creatinggame');
const routeGuard = require('./../middleware/guard');

router.get('/', routeGuard, (req, res, next) => {
  const userId = req.session.user;
  // console.log(userId);
  Game.find()
    .populate("author players")
    .then(game => {
      console.log("UNDERSTANDING  GAME DATA", game)
      const mygames=[...game].filter(item=>{
        return item.author._id == userId;
      });
      const joinedgames=[...game].map(item => {
        return item.players
        })
      console.log("NEW CONSOLE LOG", joinedgames)
      res.render('mygames', {
        game,
        mygames,
        joinedgames
      });
    })
    .catch(error => {
      next(error);
    });
});



module.exports = router;