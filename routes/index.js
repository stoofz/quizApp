const express = require('express');
const router = express.Router();
const {getPublicQuizzes} = require('../db/queries/index');

// Display all public quizzes
router.get('/', async(req, res) => {
  try {
    const publicQuzzies = await getPublicQuizzes();
    const templateVars = { quizzes: publicQuzzies };
    res.render('../views/index', templateVars);

  } catch (err) {
    console.error('Error getting public quizzes: ', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

