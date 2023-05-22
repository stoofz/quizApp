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

/*
router.get('/', (req, res) => {
  res.render('users');
});
*/

// Post endpoint to add a new user to the database
router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  db.query(
    'INSERT INTO users (name, password, email) VALUES ($1, $2, $3)',
    [req.body.name, hashedPassword, req.body.email]);
  res.redirect(302, "/home");
});

// End point to serve registration page
router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {

  res.render('login');
});


module.exports = router;
