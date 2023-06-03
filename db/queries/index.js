const db = require('../connection');

// display all public quizzes
const getPublicQuizzes = function() {
  return db.query(
    `SELECT *
    FROM quizzes
    WHERE public = TRUE;`)
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = { getPublicQuizzes };
