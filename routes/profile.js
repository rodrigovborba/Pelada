const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('profile');
});


module.exports = router;
