const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', (req, res) => {
  db.query(`
  SELECT *
  FROM quizzes
  WHERE public = TRUE;
  `)
    .then(data => {
      const templateVar = { quizzes: data.rows };
      res.render('../views/index', templateVar);
    });
});

module.exports = router;

