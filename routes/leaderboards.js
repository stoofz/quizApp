const express = require('express');
const router = express.Router();
const { mostPopular, mostTaken, mostCreated, mostDifficult } = require('../db/queries/leaderboards');
const { validUserCheck } = require('../db/queries/login');
const { getUserById } = require('../db/queries/userinfo.js');

router.get('/', async(req, res) => {
  try {

    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    // Create object with user information for _header.ejs conditionals.
    const user = await getUserById(req.session.userId);

    // Assemble data for leaderboards
    const dataPopular = await mostPopular();
    const dataDifficult = await mostDifficult();
    const dataTaken = await mostTaken();
    const dataCreated = await mostCreated();

    const templateVars = {
      mostPopular: dataPopular,
      mostDifficult: dataDifficult,
      mostTaken: dataTaken,
      mostCreated: dataCreated,
      user
    };

    res.render('../views/leaderboards', templateVars);
  } catch (err) {
    console.error('Error : ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;
