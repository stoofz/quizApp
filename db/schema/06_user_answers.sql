DROP TABLE IF EXISTS user_answers CASCADE;

CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_attempt_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  answer_id INTEGER REFERENCES quiz_answers(id) ON DELETE CASCADE
);
