/*
 * All routes for Create A New Quiz are defined here
 * Since this file is loaded in server.js into /new,
 *   these routes are mounted onto /new
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', (req, res) => {
  res.render('../views/new_quiz');
});



//set up POST router.post for form submission, redirect to home page


//need to set up db query to handled POST req and INSERT into quizzes db


module.exports = router;