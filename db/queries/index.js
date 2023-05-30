const db = require('../connection');

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
