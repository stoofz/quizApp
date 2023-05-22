const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/:quiz_id', (req, res) => {
  db.query(`
  SELECT quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
  FROM quizzes
  JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
  JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE quizzes.id = $1 AND quiz_answers.correct = TRUE;
  `, [req.params.quiz_id])
    .then(data => {
      const templateVar = {
        quizzes: data.rows,
        quizId: req.params.quiz_id,
        title: data.rows[0].title,
        answers: JSON.parse(decodeURIComponent(req.query.data))
      };
      res.render('../views/result', templateVar);
      console.log(templateVar);
    });
});

module.exports = router;
