const db = require('../connection');

// get user info by id
const getUserById = function(userId) {
  return new Promise((resolve, reject) => {

    const queryStr = `
    SELECT *
    FROM users
    WHERE id = $1;`;

    const queryParams = [userId];

    db.query(queryStr, queryParams)
      .then(data => {
        resolve(data.rows[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {getUserById};
