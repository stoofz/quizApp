const express = require('express');
const router = express.Router();
const { mostPopular, mostTaken, mostCreated } = require('../db/queries/leaderboards');
const { mostDifficult } = require('../db/queries/leaderboards');

router.get('/', (req, res) => {

  mostPopular()
    .then(dataPopular => {

      const templateVars = {
        mostPopular: dataPopular,
      };

      mostDifficult()
        .then(dataDifficult => {
          templateVars.mostDifficult = dataDifficult;
        })
        .then(() => {

          mostTaken()
            .then(dataTaken => {
              templateVars.mostTaken = dataTaken;
            })

            .then(() => {
              mostCreated()
                .then(dataCreated => {
                  templateVars.mostCreated = dataCreated;
                  res.render('../views/leaderboards', templateVars);
                });
            });
        });

    })
    .catch(err => {
      console.error('Error generating leaderboards: ', err);
      res.status(500).send('Error generating leaderboards');
    });
});



module.exports = router;
