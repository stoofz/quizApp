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
const { getUserById } = require('../db/queries/userinfo.js')

router.get('/', async (req, res) => {

  //Provides access to the page only when user is logged in. 
  if (!req.session.userId) {
    return res.status(403).send(`Status code: ${res.statusCode} - ${res.statusMessage}. Please log in or register to get started.`);
  }

  try {
    const user = await getUserById(req.session.userId);
    const templateVars = {
      user,
    };
    res.render('../views/new_quiz',templateVars);

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});

router.post('/', (req, res) => {

  /*
    - add option for setting quiz to be public or private, edit db query accordingly
  */

  // Assigning variables to the req.body content acquired from form submission.
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

  //NEED TO FORCE PAGE TO REFRESH.
  //jquery ON submit, windows.reload etc
  res.redirect('/');
});

module.exports = router;