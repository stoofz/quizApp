const express = require('express');
const router = express.Router();

// Clears session cookie
router.post('/logout', async(req, res) => {
  try {
    req.session = null;
    res.clearCookie('session');
    res.redirect('/');
  } catch (err) {
    console.error('Error clearing session: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;
