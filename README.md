# QuizApp

An app that lets you create quizzes and share them between friends. 
The creator of the quiz can view and share all the results at the end of the quiz.

## Screenshots

!["Login"](/docs/login.PNG)

!["Quiz"](/docs/quiz.PNG)

!["Leadeboards"](/docs/leaderboards.PNG)

## Dependencies

* Node 10.x or above
* NPM 5.x or above
* PG 6.x
* Express
* EJS
* cookie-session
* bcrypt
* sass
* morgan
* dotenv
* chalk


## Getting Started

* Install all dependencies (using the `npm install` command).
* Setup your PostgreSQL database
* Setup your .env (DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)
* Run start the web server using `npm run start` command.
* Browse to `http://localhost:8080`

## Features

* Register / login user
* Create public or private quizzes
* Take quizzes
* Share your results
* View your quiz attempt history
* Compete for leaderboards
