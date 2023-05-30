const express = require('express');
const router = express.Router();

router.get('/error', (req, res) => {
  try {
    const errorMessage = decodeURIComponent(req.query.message);
    res.render('error', { message: errorMessage });
  } catch (err) {
    console.error('Error rendering error page: ', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
