/*
 * All routes for Create A New Quiz are defined here
 * Since this file is loaded in server.js into /new,
 *   these routes are mounted onto /new
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { createNewQuiz } = require('../db/queries/newquiz');

router.get('/', (req, res) => {
  // const userId = req.session.userId;
  // console.log(req.session);

  res.render('../views/new_quiz');
});

//set up POST router.post for form submission, redirect to home page

router.post('/', (req, res) => {

  /*
    - update the syntax to use const {quizTilte, etc} = req.body;
    - add option for setting quiz to be public or private, edit db query accordingly
  */

  // Access the form data using req.body
  const quizTitle = req.body.quizTitle;
  const question = req.body.question;
  const option1 = req.body.option1;
  const option2 = req.body.option2;
  const option3 = req.body.option3;
  const option4 = req.body.option4;
  const correctAnswer = req.body.correctAnswer;

  console.log('Quiz submitted sucessfully!');

  createNewQuiz(req.session.userId, quizTitle);

  res.redirect('/home');

});



//need to set up db query to handled POST req and INSERT into quizzes db


module.exports = router;