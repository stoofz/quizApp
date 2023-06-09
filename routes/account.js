const express = require('express');
const router = express.Router();
const { validUserCheck } = require('../db/queries/login');
const { getUserById } = require('../db/queries/userinfo.js');
const { myQuizzes, delQuiz, changePublic } = require('../db/queries/account.js');


// Display quiz to be attempted based on params
router.get('/:user_id', async(req, res) => {
  try {
    // Check if user is logged in with valid user id
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    if (req.session.userId !== Number(req.params.user_id)) {
      res.redirect(302, `/error?message=${encodeURIComponent('Forbidden')}`);
      return;
    }

    const user = await getUserById(req.session.userId);
    const myQuizzesData = await myQuizzes(req.session.userId);

    const templateVars = {
      user,
      myQuizzesData
    };

    res.render('../views/account', templateVars);

  } catch (err) {
    console.error('Error:', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

// Delete quiz
router.post('/delete/:user_id/:quiz_id', async(req, res) => {
  try {
    // Check if user is logged in with valid user id
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    if (req.session.userId !== Number(req.params.user_id)) {
      res.redirect(302, `/error?message=${encodeURIComponent('Forbidden')}`);
      return;
    }

    await delQuiz(req.params.quiz_id);

    res.redirect(302, `/account/${req.session.userId}`);

  } catch (err) {
    console.error('Error:', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }

});

// Toggle quiz between private or public
router.post('/state/:user_id/:quiz_id/', async(req, res) => {
  try {
    // Check if user is logged in with valid user id
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    if (req.session.userId !== Number(req.params.user_id)) {
      res.redirect(302, `/error?message=${encodeURIComponent('Forbidden')}`);
      return;
    }

    await changePublic(req.params.quiz_id, req.body.state);

    res.redirect(302, `/account/${req.session.userId}`);

  } catch (err) {
    console.error('Error:', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }

});


module.exports = router;
