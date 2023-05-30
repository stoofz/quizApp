const express = require('express');
const router = express.Router();
const { createQuizArray, insertQuizAttempt, loadCorrectAnswers, findAnswerId, insertUserAnswer, addQuizResult, quizExistCheck } = require('../db/queries/quiz');
const { validUserCheck } = require('../db/queries/login');


// Display quiz to be attempted based on params
router.get('/:quiz_id', async(req, res) => {
  try {
    // Check if user is logged in with valid user id
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.redirect('/users/login');
      return;
    }

    // Check if a quiz exists with the param id
    const quizExists = await quizExistCheck(req.params.quiz_id);
    if (!quizExists) {
      res.redirect('/');
      return;
    }

    // Create an array of questions and answers for the quiz
    const quizData = await createQuizArray(req.params.quiz_id);
    const templateVars = {
      questions: quizData,
      quizTitle: quizData[0].title,
      quizId: req.params.quiz_id
    };

    res.render('../views/quiz', templateVars);
  } catch (err) {
    console.error('Error:', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});


// End point to handle quiz submission
router.post('/:quiz_id', async(req, res) => {
  try {
    // Check if user is logged in with valid user id
    const validUser = await validUserCheck(req.session.userId);
    if (!validUser) {
      res.status(401).send('Must be logged in to submit a quiz');
      return;
    }

    const quizId = req.params.quiz_id;
    const userId = req.session.userId;

    let score = 0;
    let answerId = null;
    let quizResultId = 0;

    // Insert initial quiz attempt
    const quizAttemptData = await insertQuizAttempt(quizId, userId, score);
    quizResultId = quizAttemptData[0].id;

    // Load correct answers for quiz
    const correctAnswersData = await loadCorrectAnswers(quizId);
    const submittedAnswers = req.body.a;

    for (let i = 0; i < correctAnswersData.length; i++) {
      // Find submitted answers id
      const answerData = await findAnswerId(submittedAnswers[`${i}`]);
      if (answerData[0] === undefined) {
        answerId = null;
      } else {
        answerId = answerData[0].id;
      }

      await insertUserAnswer(quizResultId, answerId);

      if (correctAnswersData[i].answer === submittedAnswers[`${i}`]) {
        score++;
      }
    }

    // Revise quiz attempt with score
    await addQuizResult(quizResultId, userId, quizId, score);
    res.redirect(302, `/result/${quizResultId}`);
  } catch (err) {
    console.error('Error:', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;
