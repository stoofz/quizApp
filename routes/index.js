const express = require('express');
const router = express.Router();
const { getPublicQuizzes } = require('../db/queries/index');
const { validUserCheck } = require('../db/queries/login');

// Display all public quizzes
router.get('/', async(req, res) => {

  try {
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    const publicQuzzies = await getPublicQuizzes();
    const templateVars = { quizzes: publicQuzzies };
    res.render('../views/index', templateVars);

  } catch (err) {
    console.error('Error: ', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

