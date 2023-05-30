const db = require('../connection');


// Aggregates question answer choices into an array inside of question object
const createQuizArray = function(quizResultId) {
  return db.query(`
  SELECT quizzes.quiz_owner_id, quizzes.title, quiz_questions.question, array_agg(quiz_answers.answer) AS answers
  FROM quizzes
  JOIN users on users.id = quiz_owner_id
  JOIN quiz_questions on quiz_questions.quiz_id = quizzes.id
  JOIN (
    SELECT quiz_answers.quiz_answer_id, quiz_answers.answer, quiz_answers.correct
    FROM quiz_answers
    GROUP BY quiz_answers.quiz_answer_id, quiz_answers.answer, quiz_answers.correct, quiz_answers.id
  	ORDER BY quiz_answers.id)
    AS quiz_answers on quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE quizzes.id = $1
  GROUP BY quizzes.quiz_owner_id, quizzes.title, quiz_questions.question, quiz_questions.id
  ORDER BY quiz_questions.id;`,
  [quizResultId]).then(data => {
    return data.rows;
  })
    .catch(error => {
      console.error(error);
    });
};


// Inserts a quiz attempt into the quiz_attempts table
const insertQuizAttempt = function(quizId, userId, quizScore) {
  return db.query(`
  INSERT INTO quiz_attempts
  (quiz_id, user_id, quiz_result)
  VALUES ($1, $2, $3)
  RETURNING id;`, [quizId, userId, quizScore])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};


// Load correct answers to quiz question set from database
const loadCorrectAnswers = function(quizId) {
  return db.query(`
  SELECT quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct, quiz_questions.quiz_id
  FROM quizzes
  JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
  JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE quizzes.id = $1 AND quiz_answers.correct = TRUE
  ORDER BY quiz_questions.id;`, [quizId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};


// Find answer id from submitted answer
const findAnswerId = function(submittedAnswer) {
  return db.query(`
  SELECT quiz_answers.id
  FROM quiz_answers
  JOIN quiz_questions ON quiz_questions.id = quiz_answers.quiz_answer_id
  WHERE answer = $1 AND quiz_questions.id = quiz_answer_id;`, [submittedAnswer])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};


// Insert user answer_id into user_answers table
const insertUserAnswer = function(quizResultId, answerId) {
  return db.query(`
  INSERT INTO user_answers (quiz_attempt_id, answer_id)
  VALUES ($1, $2);`, [quizResultId, answerId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};


// Insert quiz result into quiz_attempts table
const addQuizResult = function(quizResultId, userId, qId, score) {
  return db.query(`
  UPDATE quiz_attempts
  SET (user_id, quiz_id, quiz_result) = ($2, $3, $4)
  WHERE id = $1;`, [quizResultId, userId, qId, score])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};


const quizExistCheck = function(quizId) {
  return db.query(`
  SELECT EXISTS (
  SELECT id
  FROM quizzes
  WHERE id = $1);`, [quizId])
    .then(data => {
      return data.rows[0].exists;
    })
    .catch(error => {
      console.error(error);
    });
};


module.exports = {
  createQuizArray,
  insertQuizAttempt,
  loadCorrectAnswers,
  findAnswerId,
  insertUserAnswer,
  addQuizResult,
  quizExistCheck
};
