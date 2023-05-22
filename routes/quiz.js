const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.use(express.urlencoded({ extended: true }));

// Display quiz to be attempted based on params, aggregates answers into an array inside of one question object
router.get('/:quiz_id', (req, res) => {
  db.query(`
  SELECT
   quizzes.quiz_owner_id,
   quizzes.title,
   quiz_questions.question,
   json_agg(jsonb_build_object('answer', quiz_answers.answer, 'correct', quiz_answers.correct)) AS answers
  FROM
   quizzes
  JOIN
   users on users.id = quiz_owner_id
  JOIN
   quiz_questions on quiz_questions.quiz_id = quizzes.id
  JOIN
  (
    SELECT
    quiz_answers.quiz_answer_id,
    quiz_answers.answer,
    quiz_answers.correct
    FROM
      quiz_answers
    GROUP BY
    quiz_answers.quiz_answer_id, quiz_answers.answer, quiz_answers.correct
  ) AS quiz_answers on quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE
   quizzes.id = $1
  GROUP BY
   quizzes.quiz_owner_id, quizzes.title, quiz_questions.question, quiz_questions.id
  ORDER BY
   quiz_questions.id;`,
  [req.params.quiz_id])
    .then(data => {
      let templateVar = {
        questions: data.rows,
        quizId: req.params.quiz_id};
      res.render('../views/quiz', templateVar);
      console.log(templateVar);
    });
});

router.post('/:quiz_id', (req, res) => {
  console.log(req.body);
  const quizId = req.params.quiz_id;
  //const queryParams = new URLSearchParams(req.body).toString();
  //res.redirect(`/result/${quizId}?${queryParams}`);
  const formAnswers = JSON.stringify(req.body);
  res.redirect(`/result/${quizId}?data=${encodeURIComponent(formAnswers)}`);
});

module.exports = router;

