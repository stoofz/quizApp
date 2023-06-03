const db = require('../connection');


/**
 * Creates a new question for a quiz.
 * @param {number} quizId - The ID of the quiz the question belongs to.
 * @param {string} question - The text of the question.
 * @returns {Promise<object>} A promise that resolves to the created question object.
 */
const createQuestion = function (quizId, question) {
  return new Promise((resolve, reject) => {
    const queryStr = `
    INSERT INTO quiz_questions (quiz_id, question)
    VALUES ($1, $2)
    RETURNING *;`;

    const queryParams = [quizId, question];

    db.query(queryStr, queryParams)
      .then(data => {
        resolve(data.rows[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Inserts an answer for a question.
 * @param {number} questionId - The ID of the question the answer belongs to.
 * @param {string} answer - The text of the answer.
 * @param {boolean} isCorrect - Indicates whether the answer is correct or not.
 * @returns {Promise<object>} A promise that resolves to the inserted answer object.
 */

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


/**
 * Creates a new quiz along with its questions and answers.
 * @param {number} userId - The ID of the user creating the quiz.
 * @param {string} quizTitle - The title of the quiz.
 * @param {object} generatorObj - The generator object containing questions and answers.
 * @param {boolean} privacy - The privacy setting of the quiz (true for unlisted, false for public).
 */
const createNewQuiz = async function (userId, quizTitle, generatorObj, privacy) {
  try {
    const queryStr = `
    INSERT INTO quizzes (quiz_owner_id, title, public)
    VALUES ($1, $2, $3)
    RETURNING id;`;

    const queryParams = [userId, quizTitle, privacy];

    const data = await db.query(queryStr, queryParams);

    const quizId = data.rows[0].id;

    // Iterating through the req.body object "generatorObj" creating a new question in each loop along with answers from the respective answers array.

    for (const questionNum in generatorObj["questions"]) {
      const questionData = await createQuestion(quizId, generatorObj["questions"][questionNum]["question"]);
      // This block of code is executed when the createQuestion promise is resolved successfully.
      const questionId = questionData.id;
      let isCorrect = false;

      for (const answer of generatorObj["questions"][questionNum]["answers"]) {
        isCorrect = answer === generatorObj["questions"][questionNum]["correctAnswer"] ? true : false;
        await insertAnswer(questionId, answer, isCorrect);
      }
    }

  } catch (error) {
    console.error(error); // Reject if db.query promise is rejected
  }
};

module.exports = {
  createQuestion,
  insertAnswer,
  createNewQuiz
};
