const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Display quiz to be attempted based on params, aggregates question answers into an array inside of each question object
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
      let templateVars = {
        questions: data.rows,
        quizId: req.params.quiz_id};
      res.render('../views/quiz', templateVars);
      console.log(templateVars);
    });
});


// Insert quiz answers to db via JSON data
router.post('/:quiz_id', (req, res) => {
  const quizId = req.params.quiz_id;
  const userId = req.session.userId;
  let score = 0;

  console.log(req.body);
  console.log(quizId);
  console.log(userId);

  db.query(`
  SELECT quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
  FROM quizzes
  JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
  JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE quizzes.id = $1 AND quiz_answers.correct = TRUE;
  `, [req.params.quiz_id])
    .then(data => {
      const correctAnswers = data.rows;
      const submittedAnswers = req.body;
      console.log(correctAnswers[req.body[`q${1}`]]);
      console.log(submittedAnswers[`q${1}`]);
      console.log(correctAnswers[submittedAnswers[`q${1}`]].answer);
      for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i].answer === correctAnswers[submittedAnswers[`q${i}`]].answer) {
          score++;
        }
      }

      db.query(`INSERT INTO quiz_attempts
      (quiz_id, user_id, answer_one, answer_two, answer_three, answer_four, quiz_result)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`, [quizId, userId, parseInt(submittedAnswers[`q${0}`]), parseInt(submittedAnswers[`q${1}`]), parseInt(submittedAnswers[`q${2}`]), parseInt(submittedAnswers[`q${3}`]), score]);
    });
  //const formAnswers = JSON.stringify(req.body);
  //res.redirect(302, `/result/${quizId}?data=${encodeURIComponent(formAnswers)}`);
});

module.exports = router;
