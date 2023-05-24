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


router.post('/:quiz_id', (req, res) => {
  const quizId = req.params.quiz_id;
  const userId = req.session.userId;
  let score = 0;
  let answerId = 0;
  let quizResultId = 0;

  db.query(`INSERT INTO quiz_attempts
  (quiz_id, user_id, quiz_result)
  VALUES ($1, $2, $3)
  RETURNING id;`, [quizId, userId, 0])
    .then(data => {
      quizResultId = data.rows[0].id;
      console.log('ID:', quizResultId);
      return db.query(`
      SELECT quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
      FROM quizzes
      JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
      JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_answer_id
      WHERE quizzes.id = $1 AND quiz_answers.correct = TRUE
      ORDER BY quiz_questions.id;
      `, [req.params.quiz_id])
        .then(data => {

          const correctAnswers = data.rows;
          const submittedAnswers = req.body;

          for (let i = 0; i < correctAnswers.length; i++) {

            console.log("Quiz ID" + quizResultId);

            console.log("Submitted " + submittedAnswers[`a${i}`]);

            db.query(`
              SELECT id
              FROM quiz_answers
              WHERE answer = $1;`, [submittedAnswers[`a${i}`]])
              .then(data => {
                answerId = data.rows[0].id;
                console.log('AnswerID inside at ' + answerId);
                db.query(`INSERT INTO user_answers (quiz_attempt_id, answer_id) VALUES ($1, $2);`, [quizResultId, answerId]);
              });


            if (correctAnswers[i].answer === submittedAnswers[`a${i}`]) {
              score++;
            }
            answerId = 0;
            console.log("SCORE before insert" + score);
          }

          console.log("SCORE STILL before insert" + score);

          db.query(`
          INSERT INTO quiz_attempts
          (user_id, quiz_id, quiz_result)
          VALUES ($1, $2, $3);`, [userId, quizId, score])
            .then(() => {
              console.log('ID:', quizResultId);
              console.log('Score:', score);
              res.redirect(302, `/result/${quizResultId}`);
            });
        });
    });
});

module.exports = router;
