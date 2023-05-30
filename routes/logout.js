const express = require('express');
const router = express.Router();

// Clears session cookie
router.get('/logout', (req, res) => {
  req.session = null;
  res.clearCookie('session');
  res.redirect('/users/login');
});

module.exports = router;
