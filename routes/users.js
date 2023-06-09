/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { addUser, userExists } = require('../db/queries/users');
const { validUserCheck } = require('../db/queries/login');
const router = express.Router();


// router.get('/', (req, res) => {
//   res.render('users');
// });

// Post endpoint to add a new user to the database, bcrypts the password
router.post('/register', async(req, res) => {
  try {

    const userInfo = await userExists(req.body.email);
    if (userInfo) {
      res.redirect(302, `/error?message=${encodeURIComponent('Email already registered')}`);
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    await addUser(req.body.name, hashedPassword, req.body.email);

    const createdUser = await userExists(req.body.email);
    req.session.userId = createdUser.id;

    res.redirect(302, "/");

  } catch (err) {
    console.error('Error adding user: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

// End point to serve registration page
router.get('/register', async(req, res) => {
  try {
    const validUser = await validUserCheck(req.session.userId);
    if (validUser) {
      res.redirect(302, '/');
      return;
    }
    res.render('register', { user: req.user });
  } catch (err) {
    console.error('Error: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});


// Serve login page
router.get('/login', async(req, res) => {
  try {
    const validUser = await validUserCheck(req.session.userId);
    if (validUser) {
      res.redirect(302, '/');
      return;
    }
    res.render('login', { user: req.user });
  } catch (err) {
    console.error('Error: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

// Post login credentials and check if they are valid
router.post('/login', async(req, res) => {
  try {
    const userInfo = await userExists(req.body.email);
    if (!userInfo) {
      res.redirect(302, `/error?message=${encodeURIComponent('Invalid Login')}`);
      return;
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInfo.password);
    if (validPassword) {
      req.session.userId = userInfo.id;
      res.redirect(302, '/');
    } else {
      res.redirect(302, `/error?message=${encodeURIComponent('Invalid Login')}`);
    }
  } catch (err) {
    console.error('Error: ', err);
    res.redirect(302, `/error?message=${encodeURIComponent('Internal Server Error')}`);
  }
});

module.exports = router;
