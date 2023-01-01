var express = require('express');
var router = express.Router();
const data = []

/* GET home page. */
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  res.redirect('/penjualan');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  res.redirect('/login');
});

router.get('/logout', function(req, res) {
  res.redirect('/');
});

module.exports = router;
