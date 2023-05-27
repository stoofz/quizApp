const express = require('express');
const router = express.Router();
const { getQuestionsCorrectAnswers, getUserProvidedAnswers } = require('../db/queries/results');

// Find questions and the answers for a quiz by quiz_id
router.get('/:quizResultId', (req, res) => {

  // Find the correct answers for questions
  getQuestionsCorrectAnswers(req.params.quizResultId)
    .then(data => {
      if (data.length === 0) {
        res.redirect('/home');
        return;
      }

      const templateVars = {
        quizzes: data,
        quizResult: data[0].quiz_result,
        quizTitle: data[0].title
      };

      // Find the provided user answers
      getUserProvidedAnswers(req.params.quizResultId)
        .then(providedAnswersData => {
          if (providedAnswersData === null) {
            templateVars.answers = [];
          } else {
            templateVars.answers = providedAnswersData[0].answers;
          }

          res.render('../views/result', templateVars);
        })
        .catch(err => {
          console.error('Error loading user provided answers: ', err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch(err => {
      console.error('Error loading correct answers: ', err);
      res.status(500).send('Internal Server Error');
    });
});
module.exports = router;
