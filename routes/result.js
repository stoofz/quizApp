const express = require('express');
const router = express.Router();
const { getQuestionsCorrectAnswers, getUserProvidedAnswers } = require('../db/queries/results');

// Find questions and the answers for a quiz by quiz_id
router.get('/:quizResultId', async(req, res) => {
  try {

    // Get the correct answers for the quiz
    const data = await getQuestionsCorrectAnswers(req.params.quizResultId);

    const templateVars = {
      quizzes: data,
      quizResult: data[0].quiz_result,
      quizTitle: data[0].title
    };

    // Assemble answers provided by user
    const providedAnswersData = await getUserProvidedAnswers(req.params.quizResultId);

    if (providedAnswersData === null) {
      templateVars.answers = [];
    } else {
      templateVars.answers = providedAnswersData[0].answers;
    }

    res.render('../views/result', templateVars);
  } catch (err) {
    console.error('Error loading quiz result: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});
module.exports = router;
