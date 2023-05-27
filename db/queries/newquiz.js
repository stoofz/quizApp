const db = require('../connection');


const createNewQuiz = function (userId, quizTitle) {

  const dbQuery = `
  INSERT INTO quizzes (quiz_owner_id, title, public) VALUES($1, $2, TRUE)`;
  const reqParam = [userId, quizTitle];

  return db
    .query(dbQuery, reqParam)
    .then(data => {
      return data.rows[0];
    });
};

module.exports = createNewQuiz;