const db = require('../connection');

// Find the right answers for questions of a quiz by quiz_attempt_id
const getQuestionsCorrectAnswers = function(quizResultId) {
  return db.query(`
    SELECT quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct
    FROM quiz_attempts
    JOIN quizzes ON quiz_attempts.quiz_id = quizzes.id
    JOIN quiz_questions ON quiz_questions.quiz_id = quizzes.id
    JOIN quiz_answers ON quiz_answers.quiz_answer_id = quiz_questions.id
    WHERE quiz_attempts.id = $1 AND quiz_answers.correct = TRUE
    GROUP BY quiz_result, quizzes.title, quiz_questions.question, quiz_answers.answer, quiz_answers.correct, quiz_questions.id
    ORDER BY quiz_questions.id;
    `, [quizResultId]).then(data => {
    return data.rows;
  })
    .catch(error => {
      console.error(error);
    });
};

// Find the answers provided by the user for a quiz by quiz_attempt_id
const getUserProvidedAnswers = function(quizResultId) {
  return db.query(`
  SELECT array_agg(COALESCE(quiz_answers.answer, 'Skipped') ORDER BY user_answers.id) AS answers
  FROM user_answers
  LEFT JOIN quiz_answers ON quiz_answers.id = user_answers.answer_id
  WHERE user_answers.quiz_attempt_id = $1
  `, [quizResultId]).then(data => {
    return data.rows;
  })
    .catch(error => {
      console.error(error);
    });
};

module.exports = { getQuestionsCorrectAnswers, getUserProvidedAnswers };
