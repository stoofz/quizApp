const express = require('express');
const router = express.Router();
const { getPublicQuizzes } = require('../db/queries/index');
const { validUserCheck } = require('../db/queries/login');
const { getUserById } = require('../db/queries/userinfo.js');

// Display all public quizzes
router.get('/', async(req, res) => {

  try {
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }
    const user = await getUserById(req.session.userId);

    const publicQuzzies = await getPublicQuizzes();
    const templateVars = { quizzes: publicQuzzies, user};
    res.render('../views/index', templateVars);

  } catch (err) {
    console.error('Error: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;

