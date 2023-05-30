const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};


const addUser = function(userName, hashedPassword, email) {
  return db.query(
    `INSERT INTO users (name, password, email)
    VALUES ($1, $2, $3)`,
    [userName, hashedPassword, email])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error(error);
    });
};

const userExists = function(email) {
  return db.query(
    `SELECT * FROM users
    WHERE email = $1;
    `,
    [email])
    .then(data => {
      return data.rows[0];
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = { getUsers, addUser, userExists };
