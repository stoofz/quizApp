const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Display all public quizzes
router.get('/', (req, res) => {
  db.query(`
  SELECT *
  FROM quizzes
  WHERE public = TRUE;
  `)
    .then(data => {
      const templateVars = { quizzes: data.rows };
      res.render('../views/index', templateVars);
    });
});

module.exports = router;

