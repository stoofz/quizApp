DROP TABLE IF EXISTS quiz_attempts CASCADE;

CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  answer_one INTEGER NOT NULL,
  answer_two INTEGER NOT NULL,
  answer_three INTEGER NOT NULL,
  answer_four INTEGER NOT NULL,
  quiz_result INTEGER NOT NULL
);
