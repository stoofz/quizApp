const db = require('../connection');


const getUserInfo = function(userId) {
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

module.exports = {getUserInfo};