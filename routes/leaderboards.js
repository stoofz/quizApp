const express = require('express');
const router = express.Router();
const { mostPopular, mostTaken, mostCreated, mostDifficult } = require('../db/queries/leaderboards');

router.get('/', async(req, res) => {
  try {
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
    console.error('Error generating leaderboards: ', err);
    res.status(500).send('Error generating leaderboards');
  }
});

module.exports = router;
