/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const db = require('../db/connection');


router.get('/', (req, res) => {
  res.render('users');
});

// Post endpoint to add a new user to the database, bcrypts the password
router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  db.query(
    'INSERT INTO users (name, password, email) VALUES ($1, $2, $3)',
    [req.body.name, hashedPassword, req.body.email]);
  res.redirect(302, "/");
});

// End point to serve registration page
router.get('/register', (req, res) => {
  res.render('register');
});


// Serve login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Post login credentials and check if they are valid
router.post('/login', (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);

  db.query('SELECT * FROM users WHERE email = $1', [req.body.email], (err, result) => {
    if (err) {
      res.status(500).send("Invalid login");
    } else if (result.rows.length === 0) {
      res.status(401).send('Invalid login');
    } else {

      const user = result.rows[0];
      console.log(user);
      const validPassword = bcrypt.compareSync(req.body.password, user.password);
      if (validPassword) {
        req.session.userId = user.id;
        res.redirect(302, '/');
      } else {
        res.status(401).send('Invalid login');
      }
    }
  });
});

module.exports = router;
