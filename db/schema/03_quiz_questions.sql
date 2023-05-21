DROP TABLE IF EXISTS quiz_questions CASCADE;

CREATE table quiz_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question VARCHAR(255) NOT NULL
);
