const express = require('express');
const router = express.Router();
const { mostPopular, mostTaken, mostCreated, mostDifficult } = require('../db/queries/leaderboards');
const { validUserCheck } = require('../db/queries/login');

router.get('/', async(req, res) => {
  try {

    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }
    
    // Assemble data for leaderboards
    const dataPopular = await mostPopular();
    const dataDifficult = await mostDifficult();
    const dataTaken = await mostTaken();
    const dataCreated = await mostCreated();
    
    const templateVars = {
      mostPopular: dataPopular,
      mostDifficult: dataDifficult,
      mostTaken: dataTaken,
      mostCreated: dataCreated
    };

    res.render('../views/leaderboards', templateVars);
  } catch (err) {
    console.error('Error : ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;
