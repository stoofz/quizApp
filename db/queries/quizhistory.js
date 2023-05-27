const db = require('../connection');

// Find the answers provided by the user for a quiz by quiz_attempt_id
const getQuizHistoryforUser = function(userId) {
  return db.query(`
  SELECT quiz_id, quiz_result, quizzes.title
  FROM quiz_attempts
  JOIN quizzes on quiz_attempts.quiz_id = quizzes.id
  WHERE user_id = $1
  `, [userId]).then(data => {
    return data.rows;
  });
};

module.exports = { getQuizHistoryforUser};
