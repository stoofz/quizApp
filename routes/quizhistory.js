const express = require('express');
const router = express.Router();
const { getQuizHistoryforUser } = require('../db/queries/quizhistory');
const { validUserCheck } = require('../db/queries/login');
const { getUserById } = require('../db/queries/userinfo.js')

// Display quiz history for a specific user
router.get('/:user_id', (req, res) => {
  console.log('test');
  // Check if user is logged in with valid user id
  validUserCheck(req.session.userId)
    .then(exists => {
      if (!exists) {
        res.redirect('/users/login');
        return;
      }

      // Fetch user information
      return getUserById(req.session.userId);
    })
    .then((user) => {
      const userId = req.params.user_id;
      // Fetch quiz history for the user
      getQuizHistoryforUser(userId)
        .then(data => {
          if (data.length === 0) {
            res.render('../views/quizhistory', { results: [] }, user); // Empty array for no quiz results
          } else {

            // Add user object for _header.ejs conditionals
            const templateVars = { results: data, user};
            res.render('../views/quizhistory', templateVars);
            
          }
        })
        .catch(err => {
          console.error('Error fetching quiz history: ', err);
          res.status(500).send('Error fetching quiz history'); // Different error message for fetching quiz history
        });
    })
    .catch(err => {
      console.error('Error checking if user is valid: ', err);
      res.status(500).send('Error checking if user is valid'); // Different error message for checking user validity
    });
});

module.exports = router;
