const db = require('../connection');

// check if user is valid and in db
const validUserCheck = function(userId) {
  return db.query(`
  SELECT EXISTS (
  SELECT id
  FROM users
  WHERE id = $1);`, [userId])
    .then(data => {
      return data.rows[0].exists;
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = { validUserCheck };
