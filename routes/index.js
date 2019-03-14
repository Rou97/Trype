var express = require('express');
var router = express.Router();

const { requireAnon } = require('../middlewares/auth');

/* GET home page. */
router.get('/', requireAnon, (req, res, next) => {
  res.render('index');
});

module.exports = router;
