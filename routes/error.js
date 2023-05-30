const express = require('express');
const router = express.Router();

router.get('/error', (req, res) => {
  const errorMessage = decodeURIComponent(req.query.message);
  res.render('error', { message: errorMessage });
});

module.exports = router;
