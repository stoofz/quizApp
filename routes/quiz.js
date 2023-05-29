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
router.post('/:quiz_id', async(req, res) => {
  try {
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

    const quizAttemptData = await insertQuizAttempt(quizId, userId, score);
    quizResultId = quizAttemptData[0].id;

    const correctAnswersData = await loadCorrectAnswers(quizId);
    const submittedAnswers = req.body.a;

    for (let i = 0; i < correctAnswersData.length; i++) {
      const answerData = await findAnswerId(submittedAnswers[`${i}`]);
      //console.log(answerData[0]);
      if (answerData[0] === undefined) {
        answerId = null;
      } else {
        answerId = answerData[0].id;
        //console.log(answerId);
      }
      try {
        await insertUserAnswer(quizResultId, answerId);
      } catch (err) {
        console.error('Error inserting user answer: ', err);
        res.status(500).send('Internal Server Error');
      }

      if (correctAnswersData[i].answer === submittedAnswers[`${i}`]) {
        score++;
      }
    }

    await addQuizResult(quizResultId, userId, quizId, score);
    res.redirect(302, `/result/${quizResultId}`);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
