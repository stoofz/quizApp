const db = require('../connection');


const mostCreated = function() {
  return db.query(`
  SELECT name, COUNT(quiz_owner_id) AS count
  FROM users
  JOIN quizzes ON users.id = quizzes.quiz_owner_id
  GROUP BY name
  ORDER BY count DESC
  LIMIT 5;`
  )
    .then(data => {
      return data.rows;
    });
};


const mostTaken = function() {
  return db.query(`
  SELECT name, COUNT(quiz_id) AS count
  FROM users
  JOIN quiz_attempts ON users.id = quiz_attempts.user_id
  GROUP BY name
  ORDER BY count DESC
  LIMIT 5;`)
    .then(data => {
      return data.rows;
    });
};


const mostPopular = function() {
  return db.query(`
  SELECT title, COUNT(quiz_id) AS count
  FROM quizzes
  JOIN quiz_attempts ON quizzes.id = quiz_attempts.quiz_id
  GROUP BY title
  ORDER BY count DESC
  LIMIT 5;`)
    .then(data => {
      return data.rows;
    });
};


const mostDifficult = function() {
  return db.query(`
  SELECT title, AVG(quiz_attempts.quiz_result) AS average_result
  FROM quizzes
  JOIN quiz_attempts ON quizzes.id = quiz_attempts.quiz_id
  GROUP BY title
  HAVING COUNT(quiz_id) >= 5
  ORDER BY average_result ASC
  LIMIT 5;`)
    .then(data => {
      return data.rows;
    });
};


module.exports = { mostCreated, mostTaken, mostPopular, mostDifficult };
