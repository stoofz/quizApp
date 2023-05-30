/*
 * All routes for Create A New Quiz are defined here
 * Since this file is loaded in server.js into /new,
 *   these routes are mounted onto /new
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { createNewQuiz } = require('../db/queries/newquiz.js');

router.get('/', (req, res) => {
  // const userId = req.session.userId;
  // console.log(req.session);

  res.render('../views/new_quiz');
});

//set up POST router.post for form submission, redirect to home page

router.post('/', (req, res) => {

  /*
    - add option for setting quiz to be public or private, edit db query accordingly
  */

  // Access the form data using req.body and user id through the session cookie.
  const submission = req.body;
  const userId = req.session.userId;

  const title = submission.quizTitle;
  const question = submission.question;
  const option1 = submission.option1;
  const option2 = submission.option2;
  const option3 = submission.option3;
  const option4 = submission.option4;

  const answers = [option1, option2, option3, option4];
  let correctAnswer = submission.correctAnswer;

  if (correctAnswer === "option1") {
    correctAnswer = option1;
  } else if (correctAnswer === "option2") {
    correctAnswer = option2;
  } else if (correctAnswer === "option3") {
    correctAnswer = option3;
  } else if (correctAnswer === "option4") {
    correctAnswer = option4;
  }

  console.log(correctAnswer);
  console.log('Quiz submitted sucessfully!');
  console.log(submission);
  console.log(userId);

  createNewQuiz(userId, title, question, answers, correctAnswer);
  console.log("quiz created");
  res.redirect('/home');
});

module.exports = router;