const db = require('../connection');

const myQuizzes = function(userId) {
  return db.query(`
  SELECT quizzes.id, quizzes.title, quizzes.public
  FROM quizzes
  JOIN users ON users.id = quizzes.quiz_owner_id
  WHERE quizzes.quiz_owner_id = $1;
  `, [userId])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = { myQuizzes };
