var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Text mode' });
});

router.get('/chat', function(req, res, next) {
  res.render('pages/chat', { title: 'Text mode' });
});

router.get('/test', function(req, res, next) {
  res.render('pages/test', { title: 'Text mode' });
});

module.exports = router;
