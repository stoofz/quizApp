const express = require('express');
const router = express.Router();
const { createQuizArray, insertQuizAttempt, loadCorrectAnswers, findAnswerId, insertUserAnswer, addQuizResult, quizExistCheck } = require('../db/queries/quiz');
const { validUserCheck } = require('../db/queries/login');


// Display quiz to be attempted based on params
router.get('/:quiz_id', (req, res) => {

  // Check if user is logged in with valid user id
  validUserCheck(req.session.userId)
    .then(exists => {
      if (!exists) {
        res.redirect('/users/login');
        return;
      }
    })
    .then(() => {

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
                quizTitle: data[0].title,
                quizId: req.params.quiz_id
              };
              res.render('../views/quiz', templateVars);
            })
            .catch(err => {
              console.error('Error creating quiz and answer array: ', err);
              res.status(500).send('Internal Server Error');
            });
        });
    })
    .catch(err => {
      console.error('Error checking if user is valid: ', err);
      res.status(500).send('Internal Server Error');
    });
});


// End point to handle quiz submission
router.post('/:quiz_id', (req, res) => {

  validUserCheck(req.session.userId)
    .then(exists => {
      if (!exists) {
        res.status(401).send('Must be logged in to submit a quiz');
        return;
      }
    })
    .then(() => {

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
          loadCorrectAnswers(quizId)
            .then(data => {

              const correctAnswers = data;
              const submittedAnswers = req.body.a;

              for (let i = 0; i < correctAnswers.length; i++) {

                // Find answer id from submitted answer
                findAnswerId(submittedAnswers[`${i}`])
                  .then(data => {
                    if (data[0] === undefined) {
                      answerId = null;
                    } else {
                      answerId = data[0].id;
                    }
                    // Insert user answer_id into user_answers table
                    insertUserAnswer(quizResultId, answerId)
                      .catch(err => {
                        console.error('Error inserting answer_id to user_answer table: ', err);
                        res.status(500).send('Internal Server Error');
                      });
                  })
                  .catch(err => {
                    console.error('Error finding answer id: ', err);
                    res.status(500).send('Internal Server Error');
                  });
                if (correctAnswers[i].answer === submittedAnswers[`${i}`]) {
                  score++;
                }
              }
              // Update score in quiz_attempts table
              return addQuizResult(quizResultId, userId, quizId, score)
                .then(() => {
                  res.redirect(302, `/result/${quizResultId}`);
                });
            })
            .catch(err => {
              console.error('Error loading correct answers: ', err);
              res.status(500).send('Internal Server Error');
            });
        })
        .catch(err => {
          console.error('Error inserting quiz attempt: ', err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch(err => {
      console.error('Error checking if user is valid: ', err);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
