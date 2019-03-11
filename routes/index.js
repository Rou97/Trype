var express = require('express');
var router = express.Router();
const { requireUser } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
