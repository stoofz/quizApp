const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Find questions and the answers for a quiz by quiz_id
router.get('/:quizResultId', (req, res) => {
  db.query(`

  SELECT quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
  FROM quiz_attempts
  JOIN quizzes ON quiz_attempts.quiz_id = quizzes.id
  JOIN quiz_questions ON quiz_questions.quiz_id = quizzes.id
  JOIN quiz_answers ON quiz_answers.quiz_answer_id = quiz_questions.id
  WHERE quiz_attempts.id = $1 AND quiz_answers.correct = TRUE
  GROUP BY quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct, quiz_questions.id
  ORDER BY quiz_questions.id;
  `, [req.params.quizResultId])
    .then(async data => {
      const templateVars = {
        quizzes: data.rows,
        quizResult: data.rows[0].quiz_result,
        quizTitle: data.rows[0].title,
        quizResultId: req.params.quizResultId,
      };
      console.log("Score is at " + data.rows[0].quiz_result);

      const newData = await db.query(`
      SELECT array_agg(answer) AS answers
      FROM quiz_answers
      JOIN user_answers ON quiz_answers.id = user_answers.answer_id
      WHERE user_answers.quiz_attempt_id = $1;
      `, [req.params.quizResultId]);
      // console.log(req.params.quizResultId);
      console.log("Answers array " + newData.rows[0].answers);
      templateVars.answers = newData.rows[0].answers;
      res.render('../views/result', templateVars);
      console.log(templateVars);
    });
});
module.exports = router;
