const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Find questions and the answers for a quiz by quiz_id
router.get('/:quizResultId', (req, res) => {
  db.query(`

  SELECT ARRAY[answer_one, answer_two, answer_three, answer_four] AS answers, quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
  FROM quiz_attempts
  JOIN quizzes ON quiz_attempts.quiz_id = quizzes.id
  JOIN quiz_questions ON quiz_questions.quiz_id = quizzes.id
  JOIN quiz_answers ON quiz_answers.quiz_answer_id = quiz_questions.id
  WHERE quiz_attempts.id = $1 AND quiz_answers.correct = TRUE
  GROUP BY quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct, quiz_attempts.answer_one, quiz_attempts.answer_two, quiz_attempts.answer_three, quiz_attempts.answer_four, quiz_questions.id
  ORDER BY quiz_questions.id;
  `, [req.params.quizResultId])
    .then(data => {
      const templateVars = {
        quizzes: data.rows,
        quizResult: data.rows[0].quiz_result,
        quizTitle: data.rows[0].title,
        answers: data.rows[0].answers,
        quizResultId: req.params.quizResultId
      };
      res.render('../views/result', templateVars);
      console.log(templateVars);
    });
});

module.exports = router;
