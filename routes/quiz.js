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
    .then(validUser => {
      if (!validUser) {
        res.status(401).send('Must be logged in to submit a quiz');
        return;
      }

      const quizId = req.params.quiz_id;
      const userId = req.session.userId;

      let score = 0;
      let answerId = null;
      let quizResultId = 0;

      insertQuizAttempt(quizId, userId, score)
        .then(quizAttemptData => {
          quizResultId = quizAttemptData[0].id;

          loadCorrectAnswers(quizId)
            .then(correctAnswersData => {
              const submittedAnswers = req.body.a;

              const promises = [];
              for (let i = 0; i < correctAnswersData.length; i++) {
                promises.push(
                  findAnswerId(submittedAnswers[`${i}`])
                    .then(answerData => {
                      if (answerData[0] === undefined) {
                        answerId = null;
                      } else {
                        answerId = answerData[0].id;
                      }
                      return insertUserAnswer(quizResultId, answerId)
                        .catch(err => {
                          console.error('Error inserting answer_id to user_answer table: ', err);
                          res.status(500).send('Internal Server Error');
                        })
                        .then(() => {
                          if (correctAnswersData[i].answer === submittedAnswers[`${i}`]) {
                            score++;
                          }
                        });
                    })
                );
              }

              Promise.all(promises)
                .then(() => {
                  addQuizResult(quizResultId, userId, quizId, score)
                    .then(() => {
                      res.redirect(302, `/result/${quizResultId}`);
                    })
                    .catch(err => {
                      console.error('Error adding quiz result: ', err);
                      res.status(500).send('Internal Server Error');
                    });
                })
                .catch(err => {
                  console.error('Error:', err);
                  res.status(500).send('Internal Server Error');
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
