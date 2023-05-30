const db = require('../connection');

const createQuestion = function (quizId, question) {
  return new Promise((resolve, reject) => {
    const queryStr = `
    INSERT INTO quiz_questions (quiz_id, question)
    VALUES ($1, $2)
    RETURNING *;`;

    const queryParams = [quizId, question]; //quizzes.id = quiz_id

    db.query(queryStr, queryParams)
      .then(data => {
        resolve(data.rows[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const insertAnswer = function (questionId, answer, isCorrect) {
  return new Promise((resolve, reject) => {
    const queryStr = `
    INSERT INTO quiz_answers (quiz_answer_id, answer, correct)
    VALUES ($1, $2, $3)
    RETURNING *;`;

    const queryParams = [questionId, answer, isCorrect];

    db
      .query(queryStr, queryParams)
      .then(data => {
        resolve(data.rows[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};


const createNewQuiz = function (userId, quizTitle, question, answers, correctAnswer) {
  return new Promise((resolve, reject) => {
    const queryStr = `
    INSERT INTO quizzes (quiz_owner_id, title, public)
    VALUES ($1, $2, TRUE)
    RETURNING id;`;

    const queryParams = [userId, quizTitle];

    db.query(queryStr, queryParams)
      .then(data => {
        const quizId = data.rows[0].id;

        createQuestion(quizId, question)
          .then(questionData => {
            console.log('question object--->', questionData);
            // This block of code is executed when the createQuestion promise is resolved successfully.
            const questionId = questionData.id;
            const answerPromises = [];
            let isCorrect = false;
            for (const answer of answers) {
              isCorrect = answer === correctAnswer ? true : false;
              answerPromises.push(insertAnswer(questionId, answer, isCorrect));
            }

            Promise.all(answerPromises)
              .then(answers => {
                console.log('answers object ---->', answers);
                questionData.answers = answers;
                resolve(questionData); // Resolve with the final questionData
              })
              .catch(error => {
                reject(error); // Reject if any error occurs during answerPromises
              });
          })
          .catch(error => {
            reject(error); // Reject if createQuestion promise is rejected
          });
      })
      .catch(error => {
        reject(error); // Reject if db.query promise is rejected
      });

  });
};


module.exports = {
  createQuestion,
  insertAnswer,
  createNewQuiz
};