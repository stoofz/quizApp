const db = require('../connection');

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
      console.log(error);
    });
};

module.exports = { validUserCheck };
