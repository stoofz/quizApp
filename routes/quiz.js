const express = require('express');
const router = express.Router();
const { createQuizArray, insertQuizAttempt, loadCorrectAnswers, findAnswerId, insertUserAnswer, addQuizResult, quizExistCheck } = require('../db/queries/quiz');


// Display quiz to be attempted based on params
router.get('/:quiz_id', (req, res) => {

  // Check if a quiz exists with the param id
  quizExistCheck(req.params.quiz_id)
    .then(exists => {
      if (!exists) {
        res.redirect('/home');
        return;
      }

      // Create an array of questions and answers for the quiz
      return createQuizArray(req.params.quiz_id)
        .then(data => {
          let templateVars = {
            questions: data,
            quizId: req.params.quiz_id
          };
          res.render('../views/quiz', templateVars);
        });
    });
});


// End point to handle quiz submission
router.post('/:quiz_id', (req, res) => {
  const quizId = req.params.quiz_id;
  const userId = req.session.userId;

  let score = 0;
  let answerId = null;
  let quizResultId = 0;

  // Create an initial column in quiz_attempts table for the quiz attempt
  insertQuizAttempt(quizId, userId, score)
    .then(data => {
      quizResultId = data[0].id;

      // Load correct answers to quiz question
      return loadCorrectAnswers(quizId)
        .then(data => {

          const correctAnswers = data;
          const submittedAnswers = req.body;

          for (let i = 0; i < correctAnswers.length; i++) {

            // Find answer id from submitted answer
            findAnswerId(submittedAnswers[`a${i}`])
              .then(data => {
                if (data[0] === undefined) {
                  answerId = null;
                } else {
                  answerId = data[0].id;
                }
                // Insert user answer_id into user_answers table
                insertUserAnswer(quizResultId, answerId);
              });
            if (correctAnswers[i].answer === submittedAnswers[`a${i}`]) {
              score++;
            }
          }
          // Update score in quiz_attempts table
          addQuizResult(quizResultId, userId, quizId, score)
            .then(() => {
              res.redirect(302, `/result/${quizResultId}`);
            });
        });
    });
});

module.exports = router;
